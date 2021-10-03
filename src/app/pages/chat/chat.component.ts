import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core'
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChatMessage } from 'src/app/shared/interfaces/message.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from '../../shared/interfaces/chat.type';

@Component({
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    @ViewChild('input') msgInput: ElementRef; 
    isContentOpen = false;
    chatIdentifer: string;
    msg: string;
    chatListSubject : BehaviorSubject<any>; 
    chatList: Observable<any>
    usersList = []
    messagesList = [];
    contactDestination: string;
    chat: Chat;
    contacts = [];
    chats = []; 
    temp = []; 

    constructor(
        private sharedService: SharedService,
        private userService: UserService,
        private messageService: MessageService,
        private chatService: ChatService,
        private authService: AuthenticationService) { 
            this.chatListSubject = new BehaviorSubject<any>([]); 
            this.chatList = this.chatListSubject.asObservable(); 
        }

    ngOnInit() {

        this.chatList.subscribe(data => {
            this.chats = data; 
            console.log("my chats", this.chats)
        })

        this.authService.currentUser.subscribe(data => {
            if (data && data.fullname) {
                this.contacts = [
                    this.authService.currentUserValue.id,
                    this.contactDestination
                ]
                this.getUserChats(this.authService.currentUserValue.id)
                this.getUsers();
            }
        })

        this.sharedService.selectedUser.subscribe(selectedUser => {
            if (selectedUser) {
                this.messagesList = []
                this.chatIdentifer = selectedUser.fullname;
                // GET THE CHAT ID AND LOAD MESSAGES
                this.contacts[1] = selectedUser.id
                this.chatService.getChatByContactsId(this.contacts).then(data => {
                    if (data.data) {
                        this.chat = data.data;
                        return this.messageService.getChatMessages(this.chat.id)
                    } else {
                        throw Error("chat is emtpy")
                    }
                }).then(data => {
                    this.messagesList = data.data;
                }).catch(error => {
                    this.messagesList = []
                })
            }

        })
        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    async getUsers() {
        const { data, error } = await this.userService.listOfUsers()
        if (data) {
            this.usersList = data.filter(user => user.id != this.authService.currentUserValue.id);
        }
    }

    async getUserChats(userId) {
        const { data, error } = await this.userService.getUserChats(userId); // get user chat list
        if (data) {
            for (let userChat of data) {
                let chat = {};
                this.chatService.getChatByChatId(userChat.chat_id).then(data => { // get each chat by id
                    let response = null;
                    chat["id"] = userChat.chat_id;
                    chat["latest_message"] = data.data.latest_message;
                    if (data.data.contact_1 === userId) {
                        response = this.userService.getUserById(data.data.contact_2)
                    }
                    else {
                        response = this.userService.getUserById(data.data.contact_1)
                    }
                    return response;
                })
                    .then(data => {
                        chat["contact"] = data.data;
                        this.temp = this.chatListSubject.value; 
                        this.temp.push(chat); 
                    })
            }
            this.chatListSubject.next(this.temp); 
        }
    }

    selectChat(chat: any) {
        console.log(chat)
        this.chat = chat;
        this.chatIdentifer = chat.contact.fullname;
        this.isContentOpen = true;

        // GET Messages by chatId
        this.messageService.getChatMessages(chat.id).then(data => {
            if (data.data) {
                this.messagesList = data.data;
                console.log("message list", this.messagesList)
            }
            else {
                this.messagesList = []
            }
        });

    };



    async sendMsg(msg: string) {

        // IF MESSAGE LIST EMPTY, CREATE NEW CHAT 
        if (this.messagesList.length == 0) {
            let newChat: Chat = {
                contact_1: this.contacts[0],
                contact_2: this.contacts[1],
                created_at: new Date,
                latest_message: msg
            }
            const { data, error } = await this.chatService.addChat(newChat, this.contacts)
            this.chat = data;
        }

        // INSERT NEW MESSAGE
        console.log("current chat", this.chat);
        let message: ChatMessage = {
            chat_id: this.chat.id,
            sender: this.authService.currentUserValue.id,
            message_content: msg,
            created_at: new Date
        }

        const { data, error } = await this.messageService.addNewMessage(message)
        const savedMessage = await this.messageService.getMessageById(data.id) // doing query twice cuz ineed the sender foreign table
        if (savedMessage.data) {
            this.messagesList.push(savedMessage.data);
            this.msgInput.nativeElement.innerText = ""; 
        }
    }

    closeChatContent() {
        this.isContentOpen = false;
    }

    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }
}