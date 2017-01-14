package com.socket.message.config;

import java.util.Map;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;


public class IpHandshakeInterceptor implements HandshakeInterceptor {
	
	//private static final Logger logger = LoggerFactory.getLogger(IpHandshakeInterceptor.class);

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
		// TODO Auto-generated method stub

	}

	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler,
			Map<String, Object> attributes) throws Exception {
		// TODO set ip 
		attributes.put("ip", request.getRemoteAddress().getHostString());
		
		//logger.info(request.getRemoteAddress().getHostString());
		//userProperties.setIp(request.getRemoteAddress().getHostString());
		
		return true;
	}

}
