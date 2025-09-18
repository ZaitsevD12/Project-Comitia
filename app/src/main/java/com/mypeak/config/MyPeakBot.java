
// MyPeakBot.java
package com.mypeak.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendInvoice;
import org.telegram.telegrambots.meta.api.objects.payments.LabeledPrice;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.PhotoSize;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@Component
public class MyPeakBot extends TelegramLongPollingBot {
    @Value("${telegram.bot.token}")
    private String botToken;
    @Value("${telegram.bot.username}")
    private String botUsername;
    @Value("${telegram.admin.chatid:}")
    private String adminChatId;
    private final Map<Long, String> userStates = new HashMap<>();

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
        if (update.hasMessage()) {
            long chatId = update.getMessage().getChatId();
            if (update.getMessage().hasText()) {
                String text = update.getMessage().getText();
                System.out.println("Text: " + text);
                if (text.startsWith("/start")) {
                    SendMessage message = new SendMessage();
                    message.setChatId(String.valueOf(chatId));
                    message.setParseMode("MarkdownV2");
                    message.setText("Привет\\! 🚀 Добро пожаловать в MyPeak\\. Мы — маленькая команда энтузиастов, создаём честный инструмент для сообщества, фокусируясь на персонализации и прозрачности\\.\n" +
                            "\n" +
                            "**Крутые фишки:**\n" +
                            "\\- Ищи игры из Steam, ставь оценки \\(1\\-100\\) и делись отзывами\\.\n" +
                            "\\- Смотри популярные в аппе, топ\\-оценённые за всё время\\.\n" +
                            "\\- Верифицируем владение в Steam — твои отзывы станут супер\\-влиятельными\\.\n" +
                            "\\- Объективная оценка: взвешенное среднее для справедливости\\.\n" +
                            "\n" +
                            "**Из чего складывается оценка?**\n" +
                            "Оценка игры — это среднее от всех баллов, но с акцентом на \"вес\" отзыва\\. Больше веса у длинных отзывов, у тех, кто много играл, завершил игру или доказал владение \\(в 10 раз больше\\!\\)\\. Так фейки и спам не рулят, а настоящие мнения — да\\.\n" +
                            "\n" +
                            "**Формула для тех, кто любит детали:**\n" +
                            "Общая оценка \\= ∑\\(балл \\* вес\\) / ∑вес\n" +
                            "Вес \\= 1 \\+ 0\\.001 \\* log\\(длина\\_текста \\+ 1\\) \\+ 0\\.01 \\* √\\(часы\\_в\\_игре\\) \\+ \\(завершена? 0\\.5 : 0\\)\n" +
                            "Если верифицировано — вес × 10\\.\n" +
                            "\n" +
                            "Начни прямо сейчас: найди игру и поделись мнением\\! 💬 Мы всегда на связи для фидбека\\.");
                    try {
                        execute(message);
                    } catch (TelegramApiException e) {
                        e.printStackTrace();
                    }
                } else if (text.startsWith("/report")) {
                    userStates.put(chatId, "REPORT");
                    SendMessage message = new SendMessage();
                    message.setChatId(String.valueOf(chatId));
                    message.setText("Пожалуйста, отправьте ваш отзыв (текст и/или фото).");
                    try {
                        execute(message);
                    } catch (TelegramApiException e) {
                        e.printStackTrace();
                    }
                } else if (text.startsWith("/donate")) {
                    SendInvoice invoice = SendInvoice.builder()
                            .chatId(String.valueOf(chatId))
                            .title("Поддержите MyPeak")
                            .description("Пожертвование на развитие бота")
                            .payload("donate_payload")
                            .providerToken("")
                            .currency("XTR")
                            .startParameter("")
                            .prices(Arrays.asList(new LabeledPrice("Донат", 10)))
                            .build();
                    try {
                        execute(invoice);
                    } catch (TelegramApiException e) {
                        e.printStackTrace();
                    }
                } else if (userStates.containsKey(chatId)) {
                    processFeedback(update, chatId);
                }
            } else if (userStates.containsKey(chatId) && update.getMessage().hasPhoto()) {
                processFeedback(update, chatId);
            }
        }
    }

    private void processFeedback(Update update, long chatId) {
        userStates.remove(chatId);
        String feedback = update.getMessage().getText() != null ? update.getMessage().getText() :
                (update.getMessage().getCaption() != null ? update.getMessage().getCaption() : "");
        String photoId = null;
        if (update.getMessage().hasPhoto()) {
            PhotoSize photo = update.getMessage().getPhoto().get(update.getMessage().getPhoto().size() - 1);
            photoId = photo.getFileId();
            if (feedback.isEmpty()) {
                feedback = "Фото без текста";
            }
        }
        System.out.println("Feedback from " + chatId + ": " + feedback);
        if (photoId != null) {
            System.out.println("Photo ID: " + photoId);
        }
        if (!adminChatId.isEmpty()) {
            try {
                if (photoId != null) {
                    SendPhoto sendPhoto = SendPhoto.builder()
                            .chatId(adminChatId)
                            .photo(new InputFile(photoId))
                            .caption("Отзыв от " + chatId + ": " + feedback)
                            .build();
                    execute(sendPhoto);
                } else {
                    SendMessage sm = SendMessage.builder()
                            .chatId(adminChatId)
                            .text("Отзыв от " + chatId + ": " + feedback)
                            .build();
                    execute(sm);
                }
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }
        SendMessage thanks = SendMessage.builder()
                .chatId(String.valueOf(chatId))
                .text("Спасибо за отзыв!")
                .build();
        try {
            execute(thanks);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}