package com.socket.message.service;

import java.io.Serializable;

public class SessionVO implements Serializable {

	private static final long serialVersionUID = 4809982179768488130L;
	
	private String sessionId;
	private String nickName;
	private String ip;
	
	public String getSessionId() {
		return sessionId;
	}
	public void setSessionId(String sessionId) {
		this.sessionId = sessionId;
	}
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public String getIp() {
		return ip;
	}
	public void setIp(String ip) {
		this.ip = ip;
	}
	
}
