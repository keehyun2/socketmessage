package com.socket.message.service;

import java.io.Serializable;

public class DataVO implements Serializable {

	private static final long serialVersionUID = -3002075553904696768L;

	private String nickName;
	private String message;
	
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
}
