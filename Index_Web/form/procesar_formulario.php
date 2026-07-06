<?php
require_once __DIR__ . '/db.php';

$errors = [];

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: formulario.html.html');
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$datetime = trim($_POST['datetime'] ?? '');
$numero = (int)($_POST['numero'] ?? 1);
$telefono = trim($_POST['telefono'] ?? '');
$commission = trim($_POST['Commission'] ?? '');
$especificaciones = trim($_POST['especificaciones'] ?? '');

if ($name === '' || mb_strlen($name) < 3) {
    $errors[] = 'El nombre es obligatorio y debe tener al menos 3 caracteres.';
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'El correo electrónico no es válido.';
}

if ($telefono === '') {
    $errors[] = 'El teléfono es obligatorio.';
}

if ($commission === '') {
    $errors[] = 'Debes seleccionar un servicio.';
}

if ($especificaciones === '') {
    $errors[] = 'Debes indicar los detalles del proyecto.';
}

$attachmentName = null;
if (isset($_FILES['archive']) && $_FILES['archive']['error'] === UPLOAD_ERR_OK) {
    $targetDir = __DIR__ . '/../uploads/';
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $extension = pathinfo($_FILES['archive']['name'], PATHINFO_EXTENSION);
    $safeName = 'archivo_' . time() . '_' . bin2hex(random_bytes(3));
    $targetFile = $targetDir . $safeName . '.' . $extension;

    if (!move_uploaded_file($_FILES['archive']['tmp_name'], $targetFile)) {
        $errors[] = 'No se pudo subir el archivo adjunto.';
    } else {
        $attachmentName = basename($targetFile);
    }
}

if ($errors) {
    $message = implode('<br>', $errors);
    include __DIR__ . '/formulario.html.html';
    exit;
}

try {
    $mysqli = ensureDatabaseAndTable();
    $stmt = $mysqli->prepare('INSERT INTO commissions (name, email, preferred_datetime, item_quantity, phone, service_type, specifications, attachment_name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->bind_param('sssiisss', $name, $email, $datetime, $numero, $telefono, $commission, $especificaciones, $attachmentName);

    if (!$stmt->execute()) {
        throw new Exception('No se pudo guardar la solicitud: ' . $stmt->error);
    }

    $success = 'Solicitud enviada correctamente. Se guardó en la base de datos de XAMPP.';
    include __DIR__ . '/formulario.html.html';
} catch (Throwable $e) {
    $error = 'Error al guardar en la base de datos: ' . $e->getMessage();
    include __DIR__ . '/formulario.html.html';
}
