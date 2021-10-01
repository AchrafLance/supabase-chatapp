import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { Component, AfterViewChecked, ElementRef, ViewChild, OnInit } from '@angular/core'
import { ChatMessage } from 'src/app/shared/interfaces/message.type';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { ChatService } from 'src/app/shared/services/chat.service';
import { MessageService } from 'src/app/shared/services/message.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Chat } from '../../shared/interfaces/chat.type';
import { AppsService } from '../../shared/services/apps.service';

@Component({
    templateUrl: './chat.component.html'
})

export class ChatComponent implements OnInit, AfterViewChecked {

    @ViewChild('scrollBottom', { static: true }) private scrollContainer: ElementRef;
    isContentOpen = false;
    chatId: string;
    msg: string;
    chatList: Chat[] = [];
    usersList = []; 
    messagesList = [];
    contactDestination:string;  

    constructor( private chatSvc : AppsService, 
                 private userService: UserService,
                 private messageService: MessageService, 
                 private chatService: ChatService,
                 private authService: AuthenticationService) { }

    ngOnInit(){
        console.log(this.isContentOpen)
        this.getUsers(); 
        // this.chatSvc.getChatJSON().subscribe(data => {
        //     this.chatList = data;
        // });
        this.scrollToBottom();    
    }

    async getUsers(){
        const{data, error} = await this.userService.listOfUsers()
        if(data){
            this.usersList = data; 
        }
    }

    ngAfterViewChecked() {        
        this.scrollToBottom();        
    } 

    selectUser(user){
        this.chatId = user.fullname;
        this.contactDestination = user.id
        this.isContentOpen = true;

        //search for chat --> query chat messages 
        this.messagesList = []; 
        console.log("messages", this.messagesList)
    };

    closeChatContent() {
        this.isContentOpen = false;
    }

    async sendMsg(msg: string) {
        let chat; 
        let contacts = [
            this.authService.currentUserValue.id, 
            this.contactDestination
        ]


        // GET THE CHAT ID AND LOAD MESSAGES
        const response = await this.chatService.getChatByContactsId(contacts); 
        console.log("old chat", response)
   
        // IF MESSAGE LIST EMPTY, CREATE NEW CHAT AND ADD CHAT TO USER8CHATS TABLE
        if(this.chatList.length == 0){
            console.log("creating chat")
        
            console.log(contacts)

            let newChat:Chat = {
                contact_1 : contacts[0],
                contact_2 : contacts[1],
                created_at : new Date,
                latest_message : msg
            }
           const {data, error}  = await this.chatService.addChat(newChat, contacts)
           chat = data; 
           console.log("new chat = ", chat)
            }
    
        // INSERT NEW MESSAGE
        console.log("inserting message")
        let message: ChatMessage ={
            chat_id : chat.id, 
            sender : this.authService.currentUserValue.id, 
            message_content : msg, 
            created_at : new Date
        }

        const {data, error}= await this.messageService.addNewMessage(message)
        const savedMessage = await this.messageService.getMessageById(data.id)
        if(savedMessage.data){
            console.log("saved message", savedMessage.data)
            this.messagesList.push(savedMessage.data)
        }

    
        // for (let i = 0; i < this.chatList.length; i++) {
        //     if(this.chatId == this.chatList[i].name && this.msg.length > 1){
        //         this.chatList[i].msg.push(
        //             {
        //                 avatar: '',
        //                 text: msg,
        //                 from: 'me',
        //                 time: '',
        //                 msgType: 'text'
        //             }
        //         ) 
        //     }
        // } 
        // this.msg = '';   
    }

    scrollToBottom(): void {
        try {
            this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
        } catch(err) { }                 
    }
}  