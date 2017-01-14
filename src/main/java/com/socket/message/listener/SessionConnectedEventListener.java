package com.socket.message.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.messaging.SessionConnectedEvent;

import com.socket.message.config.UserProperties;

public class SessionConnectedEventListener implements ApplicationListener<SessionConnectedEvent>{

	private static final Logger logger = LoggerFactory.getLogger(SessionConnectedEventListener.class);
	
	private SimpMessagingTemplate messagingTemplate;
	
	public SessionConnectedEventListener(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate =  messagingTemplate;
	}
	
	@Override
	public void onApplicationEvent(SessionConnectedEvent event) {
		
		//StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(event.getMessage());
		
		//messagingTemplate.convertAndSend("/exchange/userlist", UserProperties.SESSIONS);
		
		logger.info("session connected SessionConnectedEvent ");
		
	}

}
