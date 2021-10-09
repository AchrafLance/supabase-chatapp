import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ChatMessage } from 'src/app/shared/interfaces/chat-message';
import { User } from 'src/app/shared/interfaces/user';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SupabaseService } from 'src/app/shared/services/supabase.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from '../../shared/interfaces/chat';

@Component({
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    @ViewChild('input') msgInput: ElementRef;
    isContentOpen = false;
    chatIdentifer: string;
    msg: string;
    chatListSubject: BehaviorSubject<any>;
    chatList: Observable<any>;
    usersList: User[] = [];
    messagesList: ChatMessage[] = [];
    contactDestination: string;
    chat: Chat;
    contacts: string[] = [];
    chats = [];
    temp = [];

    constructor(
        private sharedService: SharedService,
        private userService: UserService,
        private messageService: MessageService,
        private chatService: ChatService,
        private authService: AuthenticationService,
        private supabaseService: SupabaseService) {
        this.chatListSubject = new BehaviorSubject<any>([]);
        this.chatList = this.chatListSubject.asObservable();
    }

    ngOnInit() {

        this.initSupabaseListeners();

        this.authService.currentUser.subscribe(data => {
            if (data && data.fullname) {
                this.contacts = [
                    this.authService.currentUserValue.id,
                    this.contactDestination
                ];
                this.getUserChats(this.authService.currentUserValue.id);
                this.getUsers();
            }
        });

        this.chatList.subscribe(data => {
            this.chats = data;
        });


        this.sharedService.selectedUser.subscribe(selectedUser => {
            if (selectedUser) {
                this.isContentOpen = true;
                this.messagesList = [];
                this.chatIdentifer = selectedUser.fullname;
                this.contacts[1] = selectedUser.id;
                this.chatService.getChatByContactsId(this.contacts).then(data => {
                    if (data.data) {
                        // console.log("selected chat", data.data)
                        this.chat = data.data;
                        return this.messageService.getChatMessages(this.chat.id);
                    }
                })
                .then(data => {
                    if (data){
                        this.messagesList = data.data;
                    }
                }).catch(error => {
                    console.error('ERROR ADDING CHAT - ', error);
                });
            }
        });

        this.scrollToBottom();
    }

    ngAfterViewChecked() {
        this.scrollToBottom();
    }

    private initSupabaseListeners(): void {

        this.supabaseService.supabase.from('messages')
        .on('INSERT', payload => {
            if (payload.new.sender !== this.authService.currentUserValue.id) {
                this.userService.getUserById(payload.new.sender).then(data => {
                    payload.new.sender = data.data;
                    this.messagesList.push(payload.new);
                });
            }
        }).subscribe();

        this.supabaseService.supabase.from('users')
        .on('UPDATE', payload => {
            let index = null;
            index = this.usersList.findIndex(user => user.id === payload.new.id);
            if (index != null) {
                this.usersList[index] = payload.new;
            }
        }).subscribe();
    }

    private async getUsers() {
        const { data } = await this.userService.listOfUsers();
        if (data) {
            this.usersList = data.filter(user => user.id != this.authService.currentUserValue.id);
        }
    }

    private async getUserChats(userId: string) {
        const response = await this.userService.getUserChats(userId);

        if (response.body) {
            for (const userChat of response.body) {
                let chat:{chat_id:string, latest_message:string, contact:string};
                chat.chat_id = userChat.chat_id.id;
                chat.latest_message = userChat.chat_id.latest_message;
                this.supabaseService.getDestinaionContact(userChat.chat_id.id, userId).then(data => {
                chat.contact = data.data.user_id;
                this.temp = this.chatListSubject.value;
                this.temp.push(chat);
                });
            }
            this.chatListSubject.next(this.temp);
        }

    }

    selectChat(chat: any) {
        this.chat = chat;
        console.log('selected chat', chat);
        this.chatIdentifer = chat.contact.fullname;
        this.isContentOpen = true;

        // GET Messages by chatId
        this.messageService.getChatMessages(chat.chat_id).then(data => {
            if (data.data) {
                this.messagesList = data.data;
            }
            else {
                this.messagesList = [];
            }
        });

    }



    async sendMsg(msg: string) {

        // IF MESSAGE LIST EMPTY, CREATE NEW CHAT
        if (this.messagesList.length == 0) {
            const newChat: Chat = {
                contact_1: this.contacts[0],
                contact_2: this.contacts[1],
                created_at: new Date,
                latest_message: msg
            };
            console.log('new chat', newChat);
            const { data, error } = await this.chatService.save(newChat);
            if (data){
            this.chat = data;
            console.log('chat created', this.chat);
           }
           else{
               alert(JSON.stringify(error));
           }
        }

        // INSERT NEW MESSAGE
        const message: ChatMessage = {
            chat_id: this.chat.id,
            sender: this.authService.currentUserValue.id,
            message_content: msg,
            created_at: new Date
        };

        const { data, error } = await this.messageService.addNewMessage(message);
        const savedMessage = await this.messageService.getMessageById(data.id); // doing query twice cuz ineed the sender foreign table
        if (savedMessage.data) {
            this.messagesList.push(savedMessage.data);
            this.msgInput.nativeElement.value = '';
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
