// BotConfig.java (new class in com.mypeak.config)
package com.mypeak.config;

import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;

import jakarta.annotation.PostConstruct;

@Configuration
public class BotConfig {

    private final MyPeakBot myPeakBot;

    public BotConfig(MyPeakBot myPeakBot) {
        this.myPeakBot = myPeakBot;
    }

    @PostConstruct
    public void init() throws TelegramApiException {
        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        botsApi.registerBot(myPeakBot);
    }
}