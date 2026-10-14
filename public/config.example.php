<?php
// Настройки Telegram-бота для приёма заявок.
// 1. Создать бота через @BotFather, получить токен.
// 2. Добавить бота в чат/группу, узнать chat_id (например через @getmyid_bot или getUpdates).
return [
    'bot_token'   => 'PASTE_BOT_TOKEN_HERE',
    'chat_id'     => 'PASTE_CHAT_ID_HERE',
    'site_name'   => 'LEP METALL - металлоконструкции ЛЭП',
    'max_file_mb' => 20, // лимит Telegram Bot API для sendDocument - 50 МБ
    'allowed_ext' => ['pdf', 'dwg', 'dxf', 'doc', 'docx', 'xls', 'xlsx', 'jpg', 'jpeg', 'png', 'zip', 'rar'],
];
