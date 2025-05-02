<?php
// save_data.php

// Проверяем, что запрос является POST-запросом
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Получаем данные из POST-запроса
    $data = $_POST['data'];

    // Проверяем, что данные не пустые
    if (!empty($data)) {
        // Путь к JSON-файлу
        $filePath = 'data.json';

        // Если файл существует, читаем его содержимое
        if (file_exists($filePath)) {
            $jsonData = file_get_contents($filePath);
            $arrayData = json_decode($jsonData, true); // Преобразуем JSON в массив
        } else {
            $arrayData = []; // Если файла нет, создаем пустой массив
        }

        // Проверяем, существует ли уже такой ключ
        if (!array_key_exists($data, $arrayData)) {
            // Добавляем новый ключ с пустым объектом в качестве значения
            $arrayData[$data] = (object)[]; // Пустой объект

            // Сохраняем обновленные данные в JSON-файл
            $jsonData = json_encode($arrayData, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            file_put_contents($filePath, $jsonData);

            // Отправляем ответ об успешном добавлении
            echo json_encode(['status' => 'success', 'message' => 'Data added successfully']);
        } else {
            // Отправляем ответ, если ключ уже существует
            echo json_encode(['status' => 'info', 'message' => 'Data already exists']);
        }
    } else {
        // Отправляем ответ об ошибке, если данные пустые
        echo json_encode(['status' => 'error', 'message' => 'Data is empty']);
    }
} else {
    // Отправляем ответ об ошибке, если запрос не POST
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
