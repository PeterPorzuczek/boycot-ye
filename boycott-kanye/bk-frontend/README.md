# Boycott Kanye - Petition Website

A responsive Vue.js application for a petition against hate speech and antisemitism.

![Boycott Kanye Website Screenshot](https://i.imgur.com/p7VB2zD.png)

## Features

- **User Authentication**: Secure login and registration system
- **Mobile-Responsive Design**: Optimized for all device sizes with dedicated mobile navigation
- **Petition Signing**: Easy-to-use interface for signing the petition
- **Signature Management**: Users can manage their signature visibility and withdraw if needed
- **Multilingual Support**: Internationalization ready with translation system

## Technology Stack

- **Frontend**: Vue.js 3 with Composition API
- **Styling**: Custom CSS with responsive design
- **State Management**: Vue's built-in reactivity system
- **Routing**: Vue Router
- **Internationalization**: Custom i18n implementation

## Mobile Experience

The application features a dedicated mobile experience with:
- Bottom navigation bar for easy access
- Hamburger menu for secondary navigation
- Optimized layouts for small screens
- Touch-friendly UI elements

## Project Setup

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Deployment

The application can be deployed as a static site or served through Nginx using the provided configuration:

```
docker build -t boycott-kanye-frontend .
docker run -p 8080:80 boycott-kanye-frontend
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
