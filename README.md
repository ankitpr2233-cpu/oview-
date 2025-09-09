# Smart Saathi Movies Downloader

A modern, responsive movie vlog website with a two-page flow featuring countdown timers and movie download functionality.

## Features

### Page 1 (Landing Page - index.html)
- Modern movie vlog design with red and black gradient backgrounds
- "Click Here" button that triggers an 8-second countdown timer
- Countdown display with animated timer
- Instructional text: "Scroll down and click here to download your movie"
- Second "Click Here" button that appears after countdown
- Movie-themed images and content
- Glowing hover effects on buttons

### Page 2 (Download Page - download.html)
- Professional movie download page design
- Final "Click Here" button that opens the admin panel movie download link
- Movie benefits showcase section
- Responsive layout with red and black styling

## Setup Instructions

1. **Download/Clone the files** to your desired directory
2. **Configure the movie download link** in `download.js`:
   - Open `download.js`
   - Replace `https://example.com/movie-download` with your actual admin panel movie download URL
3. **Open the Smart Saathi Movies website**:
   - Open `index.html` in your web browser
   - Or serve it using a local web server for best results

## File Structure

```
fitfat/
├── index.html          # Movie vlog landing page
├── download.html       # Movie download page
├── styles.css          # Red/black styling and responsive design
├── script.js           # Landing page functionality
├── download.js         # Download page functionality
└── README.md          # This file
```

## Customization

### Changing the Download Link
Edit the `ADMIN_MOVIE_DOWNLOAD_LINK` variable in `download.js`:
```javascript
const ADMIN_MOVIE_DOWNLOAD_LINK = 'YOUR_ACTUAL_DOWNLOAD_URL_HERE';
```

### Styling Modifications
- Red and black color scheme can be modified in `styles.css`
- Movie-themed button styles are defined in the `.cta-button` and `.download-button` classes
- Responsive breakpoints are set for mobile devices

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Keyboard accessibility support

## Technologies Used

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- Vanilla JavaScript
- Google Fonts (Poppins)
- Movie-themed Images (Unsplash)
- Responsive Design Principles
