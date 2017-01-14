package com.socket.message.service;

import java.io.Serializable;

public class SourceVO  implements Serializable {

	private static final long serialVersionUID = -6002424312611994057L;

	private String nickName;
	private String codeScript;
	private Object codeConfig;
	
	public String getNickName() {
		return nickName;
	}
	public void setNickName(String nickName) {
		this.nickName = nickName;
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
