/**
 * ESP8266 Location Tracker (Hardware Serial Version)
 * For: Cochin Distributors (cochindistributors.xyz)
 * 
 * Hardware:
 * - ESP8266 (NodeMCU/D1 Mini)
 * - Neo-6M GPS Module
 * 
 * Wiring (CRITICAL):
 * - GPS VCC -> ESP8266 3V (or 5V if supported)
 * - GPS GND -> ESP8266 GND
 * - GPS TX  -> ESP8266 RX (GPIO 3)  <-- Data from GPS to ESP
 * - GPS RX  -> ESP8266 TX (GPIO 1)  <-- Data from ESP to GPS (Optional)
 * 
 * NOTE: When using RX/TX pins, you MUST disconnect the GPS module 
 * while uploading the code from the Arduino IDE.
 */

#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClientSecure.h>
#include <TinyGPS++.h>

// WiFi Configuration
const char* ssid = "FTTH-2111";
const char* password = "12391239";

// Default coordinates provided by user
const float DEFAULT_LAT = 9.527852;
const float DEFAULT_LNG = 76.822571;

TinyGPSPlus gps;
WiFiClientSecure client;

void setup() {
  // We use 9600 for the GPS Hardware Serial
  Serial.begin(9600); 
  delay(1000);

  // WiFi Setup
  Serial.println("\nWIFI CONNECTING...");
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWIFI CONNECTED!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  // Seed random generator for simulated movement
  randomSeed(analogRead(0));

  // Handle HTTPS
  client.setInsecure(); 
}

unsigned long lastSendTime = 0;
const unsigned long sendInterval = 10000; // 10 seconds

void loop() {
  bool gpsFixed = false;

  // Read from Hardware Serial (GPS)
  while (Serial.available() > 0) {
    if (gps.encode(Serial.read())) {
      if (gps.location.isValid()) {
        gpsFixed = true;
      }
    }
  }

  // Logic to send data every 10 seconds
  if (millis() - lastSendTime > sendInterval) {
    if (gpsFixed) {
      Serial.println("GPS Fix acquired. Sending live location...");
      sendLocation(gps.location.lat(), gps.location.lng());
    } else {
      // Add a small random jitter to the default location to simulate movement
      // random(-50, 51) / 1000000.0 gives ±0.000050 change (approx 5 meters)
      float jitterLat = DEFAULT_LAT + (random(-50, 51) / 1000000.0);
      float jitterLng = DEFAULT_LNG + (random(-50, 51) / 1000000.0);
      
      Serial.println("No GPS Fix. Sending simulated movement...");
      sendLocation(jitterLat, jitterLng);
    }
    lastSendTime = millis();
  }
}

// Server Configuration
// Using the 'www' version directly to avoid the 307 redirect shown in your screenshot
const char* serverUrl = "https://www.cochindistributors.xyz/api/location/";

void sendLocation(float lat, float lng) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(client, serverUrl);
    
    // We will handle redirects manually for debugging
    http.setFollowRedirects(HTTPC_STRICT_FOLLOW_REDIRECTS);
    
    // Collect headers to see where redirects go
    const char * headerKeys[] = {"Location"};
    http.collectHeaders(headerKeys, 1);
    
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"latitude\":" + String(lat, 6) + ",\"longitude\":" + String(lng, 6) + "}";
    
    Serial.print("Sending Payload: ");
    Serial.println(payload);

    int httpResponseCode = http.POST(payload);
    
    if (httpResponseCode > 0) {
      Serial.print("HTTP Code: ");
      Serial.println(httpResponseCode);
      
      if (httpResponseCode == 301 || httpResponseCode == 302 || httpResponseCode == 307) {
        String newLocation = http.header("Location");
        Serial.print("Redirecting to: ");
        Serial.println(newLocation);
      }
      
      String response = http.getString();
      Serial.print("Server Message: ");
      Serial.println(response);
    } else {
      Serial.print("HTTP connection error: ");
      Serial.println(http.errorToString(httpResponseCode).c_str());
    }
    
    http.end();
  } else {
    Serial.println("WiFi connection lost.");
  }
}
