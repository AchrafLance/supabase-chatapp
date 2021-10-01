import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core'
import { ChatMessage } from 'src/app/shared/interfaces/message.type';
import { User } from 'src/app/shared/interfaces/user.type';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from '../../shared/interfaces/chat.type';

@Component({
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    isContentOpen = false;
    chatIdentifer: string;
    msg: string;
    chatList: Chat[]; 
    usersList = [];
    messagesList = [];
    contactDestination: string;
    chat: Chat;
    contacts = []; 

    constructor(
        private userService: UserService,
        private messageService: MessageService,
        private chatService: ChatService,
        private authService: AuthenticationService) { }

    ngOnInit() {
        this.authService.currentUser.subscribe(data => {
           if(data){
            this.contacts = [
                this.authService.currentUserValue.id,
                this.contactDestination
            ]
            this.getUsers();
           }
        })
      
        console.log(this.isContentOpen)
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

    async selectUser(user:User) {
        this.chatIdentifer = user.fullname;
        this.isContentOpen = true;

        // GET THE CHAT ID AND LOAD MESSAGES
        this.contacts[1] = user.id
        const {data, error} = await this.chatService.getChatByContactsId(this.contacts);
        if(data){
            this.chat = data; 
            const messages = await this.messageService.getChatMessages(this.chat.id); 
            if(messages.body){
                this.messagesList = messages.body; 
            }
        }
        else{
            this.messagesList = []
        }
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
        let message: ChatMessage = {
            chat_id: this.chat.id,
            sender: this.authService.currentUserValue.id,
            message_content: msg,
            created_at: new Date
        }

        const { data, error } = await this.messageService.addNewMessage(message)
        const savedMessage = await this.messageService.getMessageById(data.id) // doing query twice cuz ineed the sender foreign table
        if (savedMessage.data) {
            this.messagesList.push(savedMessage.data)
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