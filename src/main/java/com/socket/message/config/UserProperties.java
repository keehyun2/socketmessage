package com.socket.message.config;

import java.util.HashMap;
import java.util.concurrent.atomic.AtomicInteger;

import com.socket.message.service.SessionVO;

public class UserProperties {
	
	private static final String GUEST_PREFIX = "Guest ";
    private static final AtomicInteger CONNECTION_IDS = new AtomicInteger(0);
    
    // static variable share in sessions
    public static final HashMap<String, SessionVO> SESSIONS= new HashMap<String, SessionVO>();
    
    public static final HashMap<String, SessionVO> SESSIONS_HOTCODE= new HashMap<String, SessionVO>();
    
    private String sessionId;
    private String clientIp;
    private String nickName;
    
    public UserProperties(){
    	this.nickName = GUEST_PREFIX + CONNECTION_IDS.getAndIncrement();
    }

	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}

	public String getClientIp() {
		return clientIp;
	}

	public void setClientIp(String clientIp) {
		this.clientIp = clientIp;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
		this.addSession();
	}
	
    
	public void addSession() {
		SessionVO sessionVO = new SessionVO();
		sessionVO.setSessionId(this.sessionId);
		sessionVO.setNickName(this.nickName);
		sessionVO.setIp(this.clientIp);
		SESSIONS.put(this.sessionId, sessionVO);
	}
	
	public void removeSession() {
		SESSIONS.remove(this.sessionId);
	}
	
}