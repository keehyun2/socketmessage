package com.socket.message;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    @MessageMapping("/k")
    @SendTo("/topic/greetings")
    public DataVO greeting(DataVO dataVO) throws Exception {
        //Thread.sleep(1000); // simulated delay
        return dataVO;
    }

}
