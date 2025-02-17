<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VayuSathi - AQI Web Application</title>
    <style>
        /* Animation for fading in elements */
        .fade-in {
            animation: fadeIn 1s ease-in-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }

        /* Smooth transition for images */
        img {
            transition: transform 0.3s ease, opacity 0.3s ease;
        }

        img:hover {
            transform: scale(1.05);
            opacity: 0.9;
        }

        /* Hover effect for buttons or links */
        .hover-effect {
            transition: color 0.3s ease, transform 0.3s ease;
        }

        .hover-effect:hover {
            color: #4CAF50;
            transform: scale(1.05);
        }

        /* Animations for sections */
        .section {
            opacity: 0;
            animation: fadeIn 1.5s forwards;
        }

        /* Apply fade-in effect with delay for each section */
        .section-1 {
            animation-delay: 0.5s;
        }

        .section-2 {
            animation-delay: 1s;
        }

        .section-3 {
            animation-delay: 1.5s;
        }

        .video {
            max-width: 100%;
            border-radius: 8px;
        }

        .tech-stack-list li {
            margin-bottom: 10px;
        }

    </style>
</head>
<body>

<h2 class="fade-in">🌿 About VayuSathi</h2>
<p class="fade-in">VayuSathi is a web application designed to provide real-time Air Quality Index (AQI) data for various locations. With an intuitive and Indian-themed design, it helps users stay informed about air pollution levels, health impacts, and safety precautions.</p>

<hr>

<h2 class="fade-in section section-1">📸 Screenshots</h2>
<p class="fade-in section section-1"><em>Below are some screenshots of the application:</em></p>
<div class="fade-in section section-1">
    <img src="path/to/screenshot1.png" alt="Screenshot 1" width="600">
    <img src="path/to/screenshot2.png" alt="Screenshot 2" width="600">
    <img src="path/to/screenshot3.png" alt="Screenshot 3" width="600">
    <img src="path/to/screenshot4.png" alt="Screenshot 4" width="600">
    <img src="path/to/screenshot5.png" alt="Screenshot 5" width="600">
</div>

<hr>

<h2 class="fade-in section section-2">🎥 Demo Video</h2>
<p class="fade-in section section-2"><em>Watch the demo video to see VayuSathi in action:</em></p>
<video class="fade-in section section-2 video" width="600" controls>
    <source src="path/to/demo-video.mp4" type="video/mp4">
    Your browser does not support the video tag.
</video>

<hr>

<h2 class="fade-in section section-3">🚀 Features</h2>
<ul class="fade-in section section-3">
    <li>Real-time AQI data for any location</li>
    <li>GPS-based AQI tracking</li>
    <li>Color-coded AQI levels for better understanding</li>
    <li>Pollutant breakdown (PM2.5, PM10, CO, NO2, SO2, O3)</li>
    <li>Health impact guide and activity suggestions</li>
    <li>Responsive design for mobile and desktop</li>
    <li>Dark mode support</li>
    <li>Historical AQI trends with interactive charts (upcoming)</li>
</ul>

<hr>

<h2 class="fade-in section section-3">📦 Installation & Setup</h2>
<h3 class="fade-in section section-3">Prerequisites</h3>
<p class="fade-in section section-3">Node.js & npm installed<br>API key for AQI data (if required)</p>

<h3 class="fade-in section section-3">Steps to Run Locally</h3>
<pre class="fade-in section section-3">
git clone https://github.com/yourusername/VayuSathi.git
cd VayuSathi
npm install
npm start
</pre>

<hr>

<h2 class="fade-in section section-3">🎨 Tech Stack</h2>
<ul class="fade-in section section-3 tech-stack-list">
    <li><strong>Frontend:</strong> React.js, Tailwind CSS</li>
    <li><strong>Backend (if applicable):</strong> Node.js, Express.js</li>
    <li><strong>API:</strong> OpenAQ, BreezoMeter, or any suitable AQI API</li>
    <li><strong>Data Visualization:</strong> Chart.js / Recharts</li>
</ul>

<hr>

<h2 class="fade-in section section-3">🤝 Contributing</h2>
<p class="fade-in section section-3">We welcome contributions! Feel free to fork the repository, make improvements, and submit a pull request.</p>
<ol class="fade-in section section-3">
    <li>Fork the project</li>
    <li>Create a new branch (<code>feature-xyz</code>)</li>
    <li>Commit your changes (<code>git commit -m 'Added a new feature'</code>)</li>
    <li>Push to your branch (<code>git push origin feature-xyz</code>)</li>
    <li>Open a pull request</li>
</ol>

<hr>

<h2 class="fade-in section section-3">📄 License</h2>
<p class="fade-in section section-3">This project is licensed under the MIT License. Feel free to modify and use it as needed.</p>

<hr>

<h2 class="fade-in section section-3">📬 Contact</h2>
<p class="fade-in section section-3">For any inquiries or feedback, reach out via email at <strong>your.email@example.com</strong> or visit our GitHub repository.</p>

<hr>
<p class="fade-in section section-3"><em>Stay informed. Breathe safe. 🌱</em></p>

</body>
</html>
