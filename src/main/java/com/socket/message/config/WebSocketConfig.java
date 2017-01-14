package com.socket.message.config;

import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.AbstractWebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.socket.message.listener.SessionConnectedEventListener;
import com.socket.message.listener.SessionDisconnectedEventListener;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig extends AbstractWebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
    	config.enableSimpleBroker("/queue/","/topic/","/exchange/");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws").addInterceptors(new IpHandshakeInterceptor()).withSockJS();
    }
    
    @Bean
    public ApplicationListener<SessionConnectedEvent> sessionConnectedEventListener(SimpMessagingTemplate messagingTemplate) {
        return new SessionConnectedEventListener(messagingTemplate);
    }
    
    @Bean
    public ApplicationListener<SessionDisconnectEvent> sessionDisConnectedEventListener(SimpMessagingTemplate messagingTemplate) {
        return new SessionDisconnectedEventListener(messagingTemplate);
    }
    
    @Bean
	@Scope(value = "websocket", proxyMode = ScopedProxyMode.TARGET_CLASS)
	public UserProperties sessionProperties() {
		return new UserProperties();
	}
   
}