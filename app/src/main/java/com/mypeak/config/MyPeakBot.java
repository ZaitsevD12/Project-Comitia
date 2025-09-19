package com.mypeak.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.AnswerPreCheckoutQuery;
import org.telegram.telegrambots.meta.api.methods.send.SendInvoice;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.payments.LabeledPrice;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.util.List;

@Component
public class MyPeakBot extends TelegramLongPollingBot {

    @Value("${telegram.bot.token}")
    private String botToken;

    @Value("${telegram.bot.username}")
    private String botUsername; // Add to properties: telegram.bot.username=YourBotUsername

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        System.out.println("Received update");

        if (update.hasPreCheckoutQuery()) {
            AnswerPreCheckoutQuery answer = new AnswerPreCheckoutQuery();
            answer.setPreCheckoutQueryId(update.getPreCheckoutQuery().getId());
            answer.setOk(true);
            try {
                execute(answer);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (update.hasMessage() && update.getMessage().hasSuccessfulPayment()) {
            SendMessage thankYou = new SendMessage();
            thankYou.setChatId(String.valueOf(update.getMessage().getChatId()));
            thankYou.setText("Спасибо за поддержку! Ваш донат вдохновляет нас развивать MyPeak. Ждем ваших отзывов и идей! ❤️");
            try {
                execute(thankYou);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        } else if (update.hasMessage() && update.getMessage().hasText()) {
            String text = update.getMessage().getText();
            System.out.println("Text: " + text);
            long chatId = update.getMessage().getChatId();
            if (text.startsWith("/start")) { // Use startsWith for parameters
                SendMessage message = new SendMessage();
                message.setChatId(String.valueOf(chatId));
                message.setParseMode("HTML");
                message.setText("Привет! 🚀 Добро пожаловать в MyPeak. Мы — маленькая команда энтузиастов, создаём честный инструмент для сообщества, фокусируясь на персонализации и прозрачности.\n" +
                        "\n" +
                        "<b>Крутые фишки:</b>\n" +
                        "- Ищи игры из Steam, ставь оценки (1-100) и делись отзывами.\n" +
                        "- Смотри популярные в аппе, топ-оценённые за всё время.\n" +
                        "- Верифицируем владение в Steam — твои отзывы станут супер-влиятельными.\n" +
                        "- Объективная оценка: взвешенное среднее для справедливости.\n" +
                        "\n" +
                        "<b>Из чего складывается оценка?</b>\n" +
                        "Оценка игры — это среднее от всех баллов, но с акцентом на \"вес\" отзыва. Больше веса у длинных отзывов, у тех, кто много играл, завершил игру или доказал владение (в 10 раз больше!). Так фейки и спам не рулят, а настоящие мнения — да.\n" +
                        "\n" +
                        "<b>Формула для тех, кто любит детали:</b>\n" +
                        "Общая оценка = ∑(балл × вес) / ∑вес\n" +
                        "Вес = 1 + 0.001 × log(длина_текста + 1) + 0.01 × √(часы_в_игре) + (завершена? 0.5 : 0)\n" +
                        "Если верифицировано — вес × 10.\n" +
                        "\n" +
                        "Начни прямо сейчас: найди игру и поделись мнением! 💬 Мы всегда на связи для фидбека.");
                try {
                    execute(message);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            } else if (text.equals("/donate")) {
                SendInvoice invoice = new SendInvoice();
                invoice.setChatId(String.valueOf(chatId));
                invoice.setTitle("Поддержите MyPeak");
                invoice.setDescription("Пожертвование на развитие бота");
                invoice.setPayload("donate_payload");
                invoice.setProviderToken("x"); // Non-empty workaround for library
                invoice.setCurrency("XTR");
                invoice.setPrices(List.of(new LabeledPrice("Донат", 100)));
                try {
                    execute(invoice);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}