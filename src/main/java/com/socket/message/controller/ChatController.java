package com.socket.message.controller;

import java.util.Collection;

import org.apache.commons.lang3.StringEscapeUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.socket.message.config.UserProperties;
import com.socket.message.service.DataVO;
import com.socket.message.service.SessionVO;
import com.socket.message.service.SourceVO;

@Controller
public class ChatController {
	
	private static final Logger logger = LoggerFactory.getLogger(ChatController.class);
	
	@Autowired private UserProperties userProperties;
	
	private SimpMessagingTemplate messagingTemplate;
	
    @MessageMapping("/chat")
    @SendTo("/topic/chat")
    public DataVO chat(DataVO dataVO) throws Exception {
    	
    	dataVO.setNickName(userProperties.getNickName());
    	// TODO : html tag convert to text
    	dataVO.setMessage(StringEscapeUtils.escapeHtml4(dataVO.getMessage()));
    	
    	// TODO : plain url text convert to html link 
    	String regExp = "(?:https|http)://([\\w/%.\\-?&=!#]+(?!.*\\[/))";
    	String toLink = "<a href='$0' target='_NEW' >$1</a>";
    	dataVO.setMessage(dataVO.getMessage().replaceAll(regExp, toLink));
    	
        return dataVO;
    }
    
    @MessageMapping("/typing")
    @SendTo("/queue/typing")
    public String typing(SimpMessageHeaderAccessor headerAccessor) throws Exception {
    	
        return headerAccessor.getSessionId();
    }
    
    @MessageMapping("/source")
    @SendTo("/queue/source")
    public SourceVO source(SourceVO sourceVO) throws Exception {
    	
    	sourceVO.setNickName(userProperties.getNickName());
        return sourceVO;
    }
    
    @MessageMapping("/nickname")
    @SendTo("/queue/members")
    public Collection<SessionVO> nickname(DataVO dataVO) throws Exception {
    	
    	if(StringUtils.isNotEmpty(dataVO.getNickName()) ){
    		userProperties.setNickName(StringEscapeUtils.escapeHtml4(dataVO.getNickName()));
    	}
        return UserProperties.SESSIONS.values();
    }
    
    @MessageMapping("/members")
    @SendTo("/queue/members")
	public Collection<SessionVO> members( SimpMessageHeaderAccessor headerAccessor) {
    	
    	userProperties.setClientIp((String)headerAccessor.getSessionAttributes().get("ip"));
    	userProperties.setSessionId(headerAccessor.getSessionId());
    	userProperties.addSession();
    	
		return UserProperties.SESSIONS.values();
	}
    
    /*@MessageMapping("/chat.private.{username}")
	public void sendPrivateMessage(DataVO dataVO, @DestinationVariable("username") String username, SimpMessageHeaderAccessor headerAccessor, Payload payload) {
    	messagingTemplate.
    	messagingTemplate.convertAndSendToUser(headerAccessor.getSessionId(), "/exchange/amq.direct/chat.message", payload);
		
	}*/

    
} 
