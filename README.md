# Realtime Chat App using Supabase/Angular 

#### A full-stack chat app using supabase for the backend and angular as the frontend framework 
#### Hosted demo: [https://priceless-allen-1c584b.netlify.app/](https://priceless-allen-1c584b.netlify.app/)
![chat app](https://user-images.githubusercontent.com/38834042/143773674-68b238b8-2b77-417f-8c6a-3e7a9eaae533.PNG)

## Team 
just me => email: achraf.contacts@gmail.com, twitter: @AElkhandouli

## Stack 
 - Supabase
 - Angular
 - Ng-zorro, Bootstrap 
 
## Features
- Google Oauth
- Realtime messaging
- persisted messages 
- profil customization
## Suapabase Usage

### Authentication
Used Google Oauth provider.

### Database Strucutre

![database structure](https://user-images.githubusercontent.com/38834042/136705235-54913527-e074-4c75-85c2-8b3c6a55ae2c.jpg)

### Supabase Realtime
Used to listen to inserts on the messsages and chats tables to update messages and chatlist for all users in realtime.
Also used to listen to updates on the users table, to display realtime user status(online/offline). 
