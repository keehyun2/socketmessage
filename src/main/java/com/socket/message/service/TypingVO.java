package com.socket.message.service;

import java.io.Serializable;

public class TypingVO implements Serializable {

	private static final long serialVersionUID = -2394316858298161699L;
	
	private String sessionID; // current typing user's session id     

	public String getSessionID() {
		return sessionID;
	}

	public void setSessionID(String sessionID) {
		this.sessionID = sessionID;
	} 
	
}
