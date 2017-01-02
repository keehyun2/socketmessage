package com.socket.message;

import java.io.Serializable;

public class DataVO implements Serializable {

	private static final long serialVersionUID = -3002075553904696768L;

	private int code; // 1:정상,2:종료,3:사용자 타이핑 알림....
	private String nickName;
	private int room;
	private String option;
	private String message;
	private String codeScript;
	private Object codeConfig; // json 데이터를 받음. 
	
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
	}
	public int getRoom() {
		return room;
	}
	public void setRoom(int room) {
		this.room = room;
	}
	public String getOption() {
		return option;
	}
	public void setOption(String option) {
		this.option = option;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	public String getCodeScript() {
		return codeScript;
	}
	public void setCodeScript(String codeScript) {
		this.codeScript = codeScript;
	}
	public Object getCodeConfig() {
		return codeConfig;
	}
	public void setCodeConfig(Object codeConfig) {
		this.codeConfig = codeConfig;
	}
	
}
