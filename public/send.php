<?php
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['ok' => false, 'error' => 'method']));
}

// Honeypot: боты заполняют скрытое поле
if (!empty($_POST['website'])) {
    exit(json_encode(['ok' => true]));
}

$cfg = require __DIR__ . '/config.php';

$clean    = fn($v, $len = 300) => htmlspecialchars(trim(mb_substr((string)$v, 0, $len)), ENT_QUOTES, 'UTF-8');
$name     = $clean($_POST['name'] ?? '');
$company  = $clean($_POST['company'] ?? '');
$phone    = $clean($_POST['phone'] ?? '');
$product  = $clean($_POST['product'] ?? '');
$quantity = $clean($_POST['quantity'] ?? '');
$comment  = $clean($_POST['comment'] ?? '', 1500);

if ($name === '' || strlen(preg_replace('/\D/', '', $phone)) < 9) {
    http_response_code(422);
    exit(json_encode(['ok' => false, 'error' => 'validation']));
}

$or = fn($v) => $v !== '' ? $v : '-';
$text = "<b>Новая заявка на расчёт - {$cfg['site_name']}</b>\n\n"
      . "<b>Имя:</b> {$name}\n"
      . "<b>Компания:</b> {$or($company)}\n"
      . "<b>Телефон:</b> {$phone}\n"
      . "<b>Продукция:</b> {$or($product)}\n"
      . "<b>Количество:</b> {$or($quantity)}\n"
      . "<b>Комментарий:</b> {$or($comment)}\n\n"
      . "<i>" . date('d.m.Y H:i') . "</i>";

function tg(string $method, array $fields, array $cfg): bool
{
    $ch = curl_init("https://api.telegram.org/bot{$cfg['bot_token']}/{$method}");
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $fields + ['chat_id' => $cfg['chat_id'], 'parse_mode' => 'HTML'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 60,
    ]);
    $resp = json_decode((string)curl_exec($ch), true);
    return !empty($resp['ok']);
}

$file = $_FILES['file'] ?? null;
$hasFile = $file && $file['error'] === UPLOAD_ERR_OK && is_uploaded_file($file['tmp_name']);

if ($hasFile) {
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $cfg['allowed_ext'], true) || $file['size'] > $cfg['max_file_mb'] * 1024 * 1024) {
        http_response_code(422);
        exit(json_encode(['ok' => false, 'error' => 'file']));
    }
    // Caption ограничен 1024 символами: отправляем текст отдельно, затем файл
    $ok = tg('sendMessage', ['text' => $text], $cfg)
       && tg('sendDocument', [
              'document' => new CURLFile($file['tmp_name'], $file['type'] ?: 'application/octet-stream', basename($file['name'])),
              'caption'  => "Файл к заявке: {$name}, {$phone}",
          ], $cfg);
} else {
    $ok = tg('sendMessage', ['text' => $text], $cfg);
}

echo json_encode(['ok' => $ok]);
