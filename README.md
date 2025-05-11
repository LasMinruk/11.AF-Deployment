[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/mNaxAqQD)

# Country Explorer

Country Explorer is a modern, responsive React + Vite application that enables users to explore countries around the globe using the [REST Countries API](https://restcountries.com/). The application features animation, filtering, search capabilities, and favorites functionality, all designed to provide a smooth user experience.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Build Process](#build-process)
- [Usage Instructions](#usage-instructions)
- [API Integration Report](#api-integration-report)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- Browse all countries with pagination
- Real-time search by country name with debouncing
- Filter by region (Africa, Asia, Americas, Europe, Oceania)
- Add/remove favorites with persistent storage
- Toggle to show only favorite countries
- Fully responsive layout with mobile-first design
- Country detail page with Google Maps integration
- Automatic scroll to top on navigation
- Loading spinners during data fetch
- Custom 404 Not Found page
- Built with Tailwind CSS & Framer Motion
- Comprehensive test coverage
- **Live Timer page to track time in real-time**
- **Professional favorite button UI with animated heart icon, color transitions, and tooltip**
- **Login prompt and popup for saving favorites when not logged in**
- **Enhanced accessibility and focus styles for interactive elements**
- **Smoother animations and transitions for a modern feel**

### Recent Improvements
- Polished favorite (heart) button with clear state, animation, and tooltip
- Visually appealing login prompt for non-logged-in users
- Tailwind CSS and PostCSS configuration fully compatible with Vite and ready for deployment
- UI/UX enhancements for accessibility, color, and animation consistency

## Tech Stack

### Frontend
- React 18.2.0
- Vite 5.1.6
- Tailwind CSS 3.4.1
- Framer Motion 12.7.4
- React Router DOM 6.22.1
- Axios 1.8.4

### Backend
- Node.js
- Express.js
- MongoDB (for favorites storage)
- RESTful API architecture

### Development Tools
- Jest 29.7.0
- ESLint 8.57.0
- PostCSS 8.4.35
- Babel
- Testing Library

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm (v7 or higher)
- Git
- MongoDB (for backend functionality)

## Setup Instructions

### Frontend Setup
1. Open a new terminal and navigate to the project directory:
```bash
# Clone the repository (if not already done)
git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-LasMinruk.git
cd af-2-LasMinruk

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend application will be available at `http://localhost:5173`

### Backend Setup
1. Open a new terminal window/tab
2. Navigate to the backend directory:
```bash
cd favorites-backend

# Install backend dependencies
npm install

# Start the backend server
npm run dev
```

The backend server will be available at `http://localhost:3000`

### Running Both Servers
To run the complete application:
1. Open two separate terminal windows/tabs
2. In the first terminal:
   ```bash
   cd af-2-LasMinruk
   npm run dev
   ```
3. In the second terminal:
   ```bash
   cd af-2-LasMinruk/favorites-backend
   npm run dev
   ```

### Troubleshooting
If you encounter any issues:
1. Ensure both Node.js and npm are installed correctly
2. Check if the required ports (5173 and 3000) are available
3. Verify all dependencies are installed in both frontend and backend
4. Make sure you're running the commands from the correct directories
5. Ensure MongoDB is running if using the favorites feature

## Build Process

### Frontend Build
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### Backend Build
```bash
# Build the backend
cd favorites-backend
npm run build

# Start the production server
npm start
```

The build process utilizes:
- Vite's optimized production build system
- Code splitting
- Tree shaking
- Minification
- Asset optimization
- Source maps for debugging

## Usage Instructions

### Browsing Countries
- Use the search bar to find countries by name (supports partial matches)
- Filter countries by region using the dropdown
- Click on a country card to view detailed information
- Use pagination controls to navigate through the country list

### Favorites Management
- Click the heart icon on any country card to add/remove from favorites
- Use the favorites toggle to show only your favorite countries
- Favorites are persisted in MongoDB
- Favorites are synced across browser sessions

### Country Details
- View comprehensive information about each country
- Click the map link to open the country's location in Google Maps
- Use the back button to return to the main view
- View detailed country statistics and information

## API Integration Report

### REST Countries API (v3.1)
The application uses the REST Countries API to fetch country data. Key endpoints used:
- `/v3.1/all` - Fetch all countries
- `/v3.1/name/{name}` - Search by country name
- `/v3.1/region/{region}` - Filter by region
- `/v3.1/alpha/{code}` - Get full details using a country code

### Backend API Endpoints
The application's backend provides the following endpoints:
- `POST /api/favorites` - Add a country to favorites
- `DELETE /api/favorites/:id` - Remove a country from favorites
- `GET /api/favorites` - Get all favorite countries
- `GET /api/favorites/:id` - Check if a country is favorited

### API Integration Challenges & Solutions

1. **Rate Limiting**
   - Challenge: API has rate limits that could affect user experience
   - Solution: Implemented client-side caching and debounced search to minimize API calls
   - Implementation: Used React Query for caching and a custom debounce hook
   - Code Example:
     ```javascript
     const debouncedSearch = useDebounce(searchTerm, 300);
     const { data, isLoading } = useQuery(['countries', debouncedSearch], () => 
       fetchCountries(debouncedSearch)
     );
     ```

2. **Data Consistency**
   - Challenge: Some country data fields were missing or inconsistent
   - Solution: Added fallback values and data validation
   - Implementation: Created data normalization utilities and default values
   - Code Example:
     ```javascript
     const normalizeCountryData = (country) => ({
       name: country.name?.common || 'Unknown Country',
       population: country.population || 0,
       region: country.region || 'Unknown Region',
       // ... other fields with fallbacks
     });
     ```

3. **Performance Optimization**
   - Challenge: Large dataset could impact initial load time
   - Solution: Implemented pagination and lazy loading for country cards
   - Implementation: Used React Window for virtualized list rendering
   - Code Example:
     ```javascript
     <FixedSizeList
       height={600}
       itemCount={countries.length}
       itemSize={200}
     >
       {({ index, style }) => (
         <CountryCard country={countries[index]} style={style} />
       )}
     </FixedSizeList>
     ```

4. **Error Handling**
   - Challenge: Network errors and API failures needed graceful handling
   - Solution: Implemented comprehensive error boundaries and fallback UI
   - Implementation: Created custom error components and error boundary wrapper
   - Code Example:
     ```javascript
     class ErrorBoundary extends React.Component {
       state = { hasError: false };
       static getDerivedStateFromError(error) {
         return { hasError: true };
       }
       render() {
         if (this.state.hasError) {
           return <ErrorFallback />;
         }
         return this.props.children;
       }
     }
     ```

5. **State Management**
   - Challenge: Managing favorites and filters across components
   - Solution: Implemented React Context API for global state management
   - Implementation: Created custom hooks for state management
   - Code Example:
     ```javascript
     const FavoritesContext = createContext();
     export const useFavorites = () => useContext(FavoritesContext);
     export const FavoritesProvider = ({ children }) => {
       const [favorites, setFavorites] = useState([]);
       // ... context implementation
     };
     ```

### API Security Considerations
- Implemented CORS policies for backend API
- Added rate limiting for API endpoints
- Sanitized user input before API calls
- Used environment variables for sensitive data

## Testing

### Frontend Testing
```bash
# Run frontend tests
npm run test:frontend

# Run frontend tests with coverage
npm run test:coverage
```

The frontend tests cover:
- Component rendering
- User interactions
- State management
- API integration
- Error handling
- Responsive design

### Backend Testing
```bash
# Run backend tests
npm run test:backend
```

The backend tests cover:
- API endpoints
- Database operations
- Error handling
- Input validation
- Data persistence

### Running All Tests
To run both frontend and backend tests:
```bash
# Run all tests
npm run test
```

Test coverage includes:
- Unit tests
- Integration tests
- API endpoint tests
- Component tests
- State management tests

For more details about backend testing, see the [Backend README](./favorites-backend/README.md).

## Deployment

> ** Live Deployment**
> 
> The application is deployed on Vercel, a free hosting platform. You can access the live version at:
> 
> - **Frontend Only(DEMO)**: [https://af-project-vercel.vercel.app/](https://af-project-vercel.vercel.app/)

> **Note:** The live demo version currently hosts only the frontend application. To experience the full functionality including favorites management and user authentication, please run the application locally with both frontend and backend services.
> 
> ** Local Development**
> 
> To run the complete application locally with all features, you can clone and run the project from GitHub:
> ```bash
> git clone https://github.com/SE1020-IT2070-OOP-DSA-25/af-2-LasMinruk.git
> ```
> 
> Follow the [Setup Instructions](#setup-instructions) to get the application running on your local machine.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Made with dedication by Lasiru
