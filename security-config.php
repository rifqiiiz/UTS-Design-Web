<?php
session_start();

// ================= SECURITY HEADERS (PHP VERSION) =================
function setSecurityHeaders() {
    // HSTS
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains; preload');
    
    // CSP - Content Security Policy
    header("Content-Security-Policy: default-src 'self'; script-src 'self' https://cdnjs.cloudflare.com https://fonts.googleapis.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://images.unsplash.com; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'");
    
    // X-Frame-Options
    header('X-Frame-Options: DENY');
    
    // X-Content-Type-Options
    header('X-Content-Type-Options: nosniff');
    
    // X-XSS-Protection
    header('X-XSS-Protection: 1; mode=block');
    
    // Referrer Policy
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    // Permissions Policy
    header("Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=(), magnetometer=(), accelerometer=(), gyroscope=()");
    
    // COOP, COEP, CORP
    header('Cross-Origin-Opener-Policy: same-origin');
    header('Cross-Origin-Embedder-Policy: require-corp');
    header('Cross-Origin-Resource-Policy: same-origin');
}

// Panggil fungsi headers
setSecurityHeaders();

// ================= COOKIE SECURITY =================
function setSecureCookie($name, $value, $expiry = 86400) {
    setcookie($name, $value, [
        'expires' => time() + $expiry,
        'path' => '/',
        'domain' => '',
        'secure' => true,
        'httponly' => true,
        'samesite' => 'Strict'
    ]);
}

// ================= IP RESTRICTION =================
function isIndonesianIP($ip) {
    $indonesiaRanges = [
        '103.10.', '103.123.', '103.137.', '103.14.', '103.15.',
        '110.136.', '110.137.', '110.138.', '110.139.',
        '114.4.', '114.5.', '114.6.', '114.7.', '114.8.', '114.9.',
        '118.96.', '118.136.', '118.137.',
        '119.2.', '119.110.',
        '120.188.', '120.189.', '120.190.', '120.191.',
        '125.160.', '125.161.', '125.162.', '125.163.', '125.164.',
        '125.165.', '125.166.',
        '139.192.', '139.193.', '139.194.', '139.195.',
        '180.241.', '180.242.', '180.243.', '180.244.', '180.245.',
        '180.246.', '180.247.', '180.248.', '180.249.', '180.250.',
        '180.251.', '180.252.', '180.253.',
        '182.1.', '182.16.', '182.23.', '182.253.', '182.30.',
        '202.146.', '202.148.', '202.149.', '202.150.',
        '202.152.', '202.154.', '202.155.', '202.158.', '202.159.',
        '202.160.', '202.162.', '202.166.', '202.168.', '202.169.',
        '202.171.', '202.177.', '202.179.', '202.180.', '202.182.',
        '203.101.', '203.114.', '203.115.', '203.116.', '203.117.',
        '203.118.', '203.119.', '203.120.', '203.121.', '203.122.',
        '203.123.', '203.124.', '203.125.', '203.126.', '203.127.',
        '203.128.', '203.129.', '203.130.', '203.131.', '203.132.',
        '203.133.', '203.134.', '203.135.', '203.136.', '203.137.',
        '203.138.', '203.139.', '203.140.', '203.141.', '203.142.',
        '203.143.', '203.144.', '203.145.', '203.146.', '203.147.',
        '203.148.', '203.149.', '203.150.', '203.151.', '203.152.',
        '203.153.', '203.158.', '203.161.', '203.174.', '203.176.',
        '203.177.', '203.190.', '203.191.', '203.192.', '203.194.',
        '203.195.', '203.196.', '203.197.', '203.198.', '203.199.',
        '203.200.', '203.201.', '203.202.', '203.203.', '203.204.',
        '203.205.', '203.206.', '203.207.', '203.208.', '203.209.',
        '203.210.', '203.211.', '203.212.', '203.213.', '203.214.',
        '203.215.', '203.217.', '203.218.', '203.219.', '203.220.',
        '203.221.', '203.222.', '203.223.',
        '211.23.', '211.24.', '211.25.', '211.26.', '211.27.',
        '211.28.', '211.29.', '211.30.', '211.31.', '211.32.',
        '211.33.', '211.34.', '211.35.', '211.36.', '211.37.',
        '211.38.', '211.39.', '211.40.', '211.41.', '211.42.',
        '211.43.', '211.44.', '211.45.', '211.46.', '211.47.',
        '211.48.', '211.49.', '211.50.', '211.51.', '211.52.',
        '211.53.', '211.54.', '211.55.', '211.56.', '211.57.',
        '211.58.', '211.59.', '211.60.', '211.61.', '211.62.',
        '211.63.', '211.64.', '211.65.', '211.66.', '211.67.',
        '211.68.', '211.69.', '211.70.', '211.71.', '211.72.',
        '211.73.', '211.74.', '211.75.', '211.76.', '211.77.',
        '211.78.', '211.79.', '211.80.', '211.81.', '211.82.',
        '211.83.', '211.84.', '211.85.', '211.86.', '211.87.',
        '211.88.', '211.89.', '211.90.', '211.91.', '211.92.',
        '211.93.', '211.94.', '211.95.', '211.96.', '211.97.',
        '211.98.', '211.99.', '211.100.', '211.101.', '211.102.',
        '211.103.', '211.104.', '211.105.', '211.106.', '211.107.',
        '211.108.', '211.109.', '211.110.', '211.111.',
        '222.124.', '222.165.',
        '27.111.', '27.112.', '27.113.', '27.114.', '27.115.',
        '27.116.', '27.117.', '27.118.', '27.119.', '27.120.',
        '27.121.', '27.122.', '27.123.', '27.124.', '27.125.',
        '27.126.', '27.127.', '27.128.', '27.129.', '27.130.',
        '27.131.'
    ];
    
    foreach ($indonesiaRanges as $range) {
        if (strpos($ip, $range) === 0) {
            return true;
        }
    }
    return false;
}

// Cek IP Indonesia
$clientIP = $_SERVER['REMOTE_ADDR'];
if (!isIndonesianIP($clientIP)) {
    http_response_code(403);
    die('<h1>Akses Ditolak</h1><p>Maaf, website ini hanya dapat diakses dari Indonesia.</p>');
}

// ================= SESSION SECURITY =================
ini_set('session.cookie_httponly', 1);
ini_set('session.use_only_cookies', 1);
ini_set('session.cookie_secure', 1);
ini_set('session.cookie_samesite', 'Strict');

// Regenerasi session ID
if (!isset($_SESSION['created'])) {
    $_SESSION['created'] = time();
} else if (time() - $_SESSION['created'] > 1800) {
    session_regenerate_id(true);
    $_SESSION['created'] = time();
}

// ================= INPUT SANITIZATION =================
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// ================= CSRF TOKEN =================
function generateCSRFToken() {
    if (!isset($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verifyCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// ================= RATE LIMITING =================
function checkRateLimit($key, $limit = 10, $window = 60) {
    $rateKey = 'rate_limit_' . $key;
    if (!isset($_SESSION[$rateKey])) {
        $_SESSION[$rateKey] = ['count' => 1, 'first_request' => time()];
        return true;
    }
    
    $data = $_SESSION[$rateKey];
    if (time() - $data['first_request'] > $window) {
        $_SESSION[$rateKey] = ['count' => 1, 'first_request' => time()];
        return true;
    }
    
    if ($data['count'] >= $limit) {
        return false;
    }
    
    $_SESSION[$rateKey]['count']++;
    return true;
}
?>