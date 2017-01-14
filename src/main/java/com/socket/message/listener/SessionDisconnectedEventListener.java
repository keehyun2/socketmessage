package com.socket.message.listener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.socket.message.config.UserProperties;

public class SessionDisconnectedEventListener implements ApplicationListener<SessionDisconnectEvent>{

	private static final Logger logger = LoggerFactory.getLogger(SessionDisconnectedEventListener.class);
	
	private SimpMessagingTemplate messagingTemplate;
	
	public SessionDisconnectedEventListener(SimpMessagingTemplate messagingTemplate) {
		this.messagingTemplate =  messagingTemplate;
	}
	
	@Override
	public void onApplicationEvent(SessionDisconnectEvent event) {
		
		UserProperties.SESSIONS.remove(event.getSessionId());
		messagingTemplate.convertAndSend("/queue/members", UserProperties.SESSIONS);
		logger.info("session disconnected SessionConnectedEvent ");
		
	}

}
