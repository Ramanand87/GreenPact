# Profile Page Components

This directory contains all modular components for the Profile page. The page has been divided into reusable, maintainable components while preserving all RTK queries, mutations, and functions.

## Component Structure

### Core Components

#### 1. **ProfileHeader.jsx**
Displays the user's profile header with avatar, basic information, and action buttons.

**Props:**
- `profile` - User profile data
- `ratings` - User ratings data
- `currentUser` - Current logged-in username
- `username` - Profile username
- `userRole` - User role (farmer/contractor)
- `calculateAverageRating` - Function to calculate average rating
- `handleEditClick` - Function to open edit dialog
- `handleChatClick` - Function to initiate chat
- `router` - Next.js router instance

#### 2. **EditProfileDialog.jsx**
Modal dialog for editing profile information with webcam support.

**Props:**
- `editOpen` - Dialog open state
- `setEditOpen` - Function to set dialog state
- `phone` - Phone number state
- `setPhone` - Function to set phone
- `address` - Address state
- `setAddress` - Function to set address
- `profilePic` - Profile picture state
- `setProfilePic` - Function to set profile picture
- `handleProfileSubmit` - Function to submit profile updates
- `isUpdatingProfile` - Loading state for profile update

#### 3. **ProfileTabs.jsx**
Tab navigation component for switching between different profile sections.

**Props:**
- `username` - Profile username
- `currentUser` - Current logged-in username
- `profileRole` - User role (farmer/contractor)

### Review Components

#### 4. **RatingSummaryCard.jsx**
Displays rating summary with average rating and distribution.

**Props:**
- `ratings` - Ratings data
- `calculateAverageRating` - Function to calculate average
- `countRatingsByValue` - Function to count ratings by value
- `calculateRatingPercentage` - Function to calculate percentage

#### 5. **AddReviewForm.jsx**
Form for adding new reviews with star rating and image upload.

**Props:**
- `profileName` - Name of profile being reviewed
- `rating` - Current rating value
- `setRating` - Function to set rating
- `description` - Review description
- `setDescription` - Function to set description
- `images` - Array of uploaded images
- `setImages` - Function to set images
- `handleImageChange` - Function to handle image upload
- `handleRatingSubmit` - Function to submit review

#### 6. **ReviewsList.jsx**
Displays list of all reviews with edit/delete functionality.

**Props:**
- `ratings` - Ratings data
- `userInfo` - Current user information
- `editingRatingId` - ID of rating being edited
- `setEditingRatingId` - Function to set editing state
- `rating` - Rating value
- `setRating` - Function to set rating
- `description` - Review description
- `setDescription` - Function to set description
- `setImages` - Function to set images
- `images` - Array of images
- `handleImageChange` - Function to handle image upload
- `handleDeleteRating` - Function to delete rating
- `handleUpdateRating` - Function to update rating

### Tab Content Components

#### 7. **DocumentsTab.jsx**
Displays verification documents (Aadhar, screenshots).

**Props:**
- `profile` - User profile data
- `currentUser` - Current logged-in username
- `username` - Profile username

#### 8. **ContractsTab.jsx**
Shows all user contracts with details.

**Props:**
- `contracts` - Contracts data from RTK query

#### 9. **PaymentsTab.jsx**
Displays payment history and transaction details.

**Props:**
- `payments` - Payments data from RTK query
- `paymentLoading` - Loading state
- `userRole` - User role (farmer/contractor)
- `currentUser` - Current logged-in username
- `router` - Next.js router instance

#### 10. **CropsTab.jsx**
Displays farmer's crops.

**Props:**
- `crops` - Array of crop data
- `language` - Current language for translations

#### 11. **DemandsTab.jsx**
Displays contractor's crop demands.

**Props:**
- `demands` - Demands data
- `language` - Current language
- `router` - Next.js router instance
- `generateColor` - Function to generate gradient colors

### State Components

#### 12. **ProfileStates.jsx**
Loading and error state components.

**Exports:**
- `LoadingState` - Loading spinner with message
- `ErrorState` - Error display with go back button

## RTK Queries & Mutations Preserved

All RTK queries and mutations are maintained in the main page file:

### Queries
- `useGetProfileQuery(username)`
- `useGetRatingQuery(username)`
- `useGetAllContractsQuery()`
- `useGetPaymentsQuery()`
- `useGetRoomsQuery()`
- `useGetCropsQuery(username)`
- `useGetAllDemandsQuery(username)`

### Mutations
- `useUpdateProfileMutation()`
- `useCreateRatingMutation()`
- `useDeleteRatingMutation()`
- `useUpdateRatingMutation()`
- `useCreateRoomMutation()`

## Key Functions Preserved

All important functions are maintained in the main page:
- `generateColor()` - Generates gradient colors
- `handleEditClick()` - Opens edit dialog
- `handleProfileSubmit()` - Submits profile updates
- `dataURItoBlob()` - Converts data URI to blob
- `handleChatClick()` - Initiates chat
- `handleRatingSubmit()` - Submits rating
- `handleImageChange()` - Handles image upload
- `handleDeleteRating()` - Deletes rating
- `handleUpdateRating()` - Updates rating
- `calculateAverageRating()` - Calculates average rating
- `countRatingsByValue()` - Counts ratings by value
- `calculateRatingPercentage()` - Calculates rating percentage

## State Management

All state variables are preserved:
- Rating state
- Review description
- Images array
- Has rated flag
- Editing rating ID
- Profile edit dialog state
- Phone and address state
- Profile picture state

## Benefits

✅ **Modular Architecture** - Each component has a single responsibility
✅ **Reusability** - Components can be reused across the application
✅ **Maintainability** - Easier to debug and update individual components
✅ **Type Safety** - Clear prop interfaces for each component
✅ **Performance** - Better optimization opportunities
✅ **Testing** - Individual components can be tested in isolation
✅ **RTK Preserved** - All queries, mutations, and state management intact
✅ **Functions Preserved** - All business logic and utility functions maintained

## Usage

Import components in the main profile page:

\`\`\`jsx
import { 
  ProfileHeader, 
  EditProfileDialog, 
  ProfileTabs,
  // ... other components
} from "@/components/Profile";
\`\`\`

Or use individual imports:

\`\`\`jsx
import { ProfileHeader } from "@/components/Profile/ProfileHeader";
\`\`\`
