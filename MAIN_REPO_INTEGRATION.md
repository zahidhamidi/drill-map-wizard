# Integration Guide: Linking Main Repository to Drill-Map-Wizard

This document provides step-by-step instructions to integrate the drill-map-wizard channel mapping functionality into your main repository (`well-data-refine-62-main`).

## Quick Integration

### Step 1: Copy Files to Main Repository

Copy these files/folders from this project to your main repository:

```
# Copy the entire drilling components folder
src/components/drilling/
├── DrillingInterface.tsx
├── StepProgress.tsx
├── FileUpload.tsx
├── DataAudit.tsx
├── TimestampFormat.tsx
├── ColumnMapping.tsx
└── DataPreview.tsx

# Copy the channel mapping page
src/pages/ChannelMapping.tsx
```

### Step 2: Update App.tsx Routing

Add the new route to your main repository's `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ChannelMapping from "./pages/ChannelMapping"; // Add this import
import NotFound from "./pages/NotFound";

// ... existing code ...

<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/channel-mapping" element={<ChannelMapping />} /> {/* Add this route */}
  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
  <Route path="*" element={<NotFound />} />
</Routes>
```

### Step 3: Update Launch Button

In your main repository's EDGE Channel Mapping Tool card, update the Launch button to use internal navigation:

```tsx
import { useNavigate } from 'react-router-dom';

const YourMainComponent = () => {
  const navigate = useNavigate();

  const handleLaunchChannelMapping = () => {
    navigate('/channel-mapping');
  };

  return (
    <div className="card">
      <h3>EDGE Channel Mapping Tool</h3>
      <p>Process and map drilling sensor data...</p>
      <button 
        onClick={handleLaunchChannelMapping}
        className="launch-button"
      >
        Launch
      </button>
    </div>
  );
};
```

### Step 4: Copy Design System (if needed)

If your main repository doesn't have the same design tokens, copy these from `src/index.css`:

```css
/* Add these design tokens to your main repository's CSS */
:root {
  --step-active: 219 78% 58%;
  --step-complete: 134 61% 41%;
  --step-inactive: 215 16% 47%;
  --table-header: 214 31% 91%;
  --table-row-even: 210 40% 98%;
  --table-row-hover: 210 40% 96%;
  --success: 134 61% 41%;
  --success-foreground: 356 29% 98%;
  --warning: 38 92% 50%;
  --error: 0 84% 60%;
}
```

## File Structure After Integration

Your main repository structure should look like this:

```
well-data-refine-62-main/
├── src/
│   ├── components/
│   │   ├── drilling/           # New drilling components
│   │   │   ├── DrillingInterface.tsx
│   │   │   ├── StepProgress.tsx
│   │   │   ├── FileUpload.tsx
│   │   │   ├── DataAudit.tsx
│   │   │   ├── TimestampFormat.tsx
│   │   │   ├── ColumnMapping.tsx
│   │   │   └── DataPreview.tsx
│   │   └── ... (your existing components)
│   ├── pages/
│   │   ├── ChannelMapping.tsx  # New channel mapping page
│   │   └── ... (your existing pages)
│   └── App.tsx                 # Updated with new route
```

## Testing the Integration

1. Start your main repository development server
2. Navigate to the home page
3. Click the "Launch" button on the EDGE Channel Mapping Tool card
4. Verify that the 5-step drilling interface loads correctly
5. Test the complete workflow: Upload → Audit → Format → Map → Export

## Functionality Overview

The integrated channel mapping tool provides:

1. **File Upload**: Drag & drop support for LAS, XLSX, CSV files
2. **Data Audit**: Automatic quality checks (completeness, conformity, continuity)
3. **Timestamp Format**: Standardization to dd/mm/yyyy HH:mm:ss format
4. **Column Mapping**: 4-column mapping interface with channel bank dictionary
5. **Preview & Export**: Data preview with LAS file export functionality

## Customization

### Channel Bank Dictionary

Modify `src/components/drilling/ColumnMapping.tsx` to update the channel bank:

```tsx
const channelBank = {
  "YOUR_CHANNEL": { standardName: "STD_NAME", unit: "unit" },
  // Add your specific drilling channels here
};
```

### Styling

The components use your existing design system. Customize colors and styling by updating the CSS variables in your main repository's CSS files.

## Notes

- All components maintain the exact same functionality as the standalone drill-map-wizard
- The integration uses React Router for seamless navigation
- No external dependencies are required beyond what's already in the main repository
- The design system integrates with your existing theme

## Support

If you encounter issues during integration, verify:
1. All files were copied correctly
2. Import paths are correct
3. Required dependencies are installed
4. Design tokens are properly defined
