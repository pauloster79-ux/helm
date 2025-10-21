# Helm Button Color System

## Standardized HSL Color Values

This document defines the exact color specifications for all buttons in Helm to ensure consistent branding and user experience.

### Primary Actions (Create, Save, Submit)
- **HSL**: `198.6 88.7% 48.4%` (Blue)
- **Usage**: Create Task, Save Project, Submit Form, Primary CTAs
- **CSS**: `hsl(198.6, 88.7%, 48.4%)`
- **Tailwind**: Custom blue variant

### Destructive Actions (Delete, Remove)
- **HSL**: `0 84.2% 60.2%` (Red)
- **Usage**: Delete Task, Remove User, Cancel Project, Destructive actions
- **CSS**: `hsl(0, 84.2%, 60.2%)`
- **Tailwind**: Custom red variant

### Update/Edit Actions
- **HSL**: `142.1 70.6% 45.3%` (Green)
- **Usage**: Update Task, Save Changes, Apply Settings, Edit actions
- **CSS**: `hsl(142.1, 70.6%, 45.3%)`
- **Tailwind**: Custom green variant

### Secondary Actions (Cancel, Close, Back)
- **HSL**: `240 3.8% 46.1%` (Grey)
- **Usage**: Cancel, Close, Back, Discard Changes, Secondary actions
- **CSS**: `hsl(240, 3.8%, 46.1%)`
- **Tailwind**: Custom grey variant

### Warning Actions (Archive, Suspend)
- **HSL**: To be defined (Orange/Amber)
- **Usage**: Archive Project, Suspend User, Mark as Inactive
- **CSS**: TBD
- **Tailwind**: TBD

## Implementation Guidelines

1. **Always use these exact HSL values** for consistency
2. **Hover states** should be 5-10% darker (reduce lightness)
3. **Disabled states** should be 20-30% lighter with reduced opacity
4. **Text color** should be white for all colored buttons
5. **Outline variants** should use the same HSL with transparent background

## Button Hierarchy

1. **Primary** (Blue) - Most important action on the page
2. **Destructive** (Red) - Actions that remove/delete content
3. **Update** (Green) - Actions that modify existing content
4. **Secondary** (Grey) - Actions that cancel or navigate away
5. **Warning** (Orange) - Actions that have significant but non-destructive consequences

## Examples

```css
/* Primary Button */
.btn-primary {
  background-color: hsl(198.6, 88.7%, 48.4%);
  color: white;
}

.btn-primary:hover {
  background-color: hsl(198.6, 88.7%, 38.4%);
}

/* Destructive Button */
.btn-destructive {
  background-color: hsl(0, 84.2%, 60.2%);
  color: white;
}

.btn-destructive:hover {
  background-color: hsl(0, 84.2%, 50.2%);
}

/* Update Button */
.btn-update {
  background-color: hsl(142.1, 70.6%, 45.3%);
  color: white;
}

.btn-update:hover {
  background-color: hsl(142.1, 70.6%, 35.3%);
}

/* Secondary Button */
.btn-secondary {
  background-color: hsl(240, 3.8%, 46.1%);
  color: white;
}

.btn-secondary:hover {
  background-color: hsl(240, 3.8%, 36.1%);
}
```

## Tailwind Configuration

Add these custom colors to your `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'helm-blue': 'hsl(198.6, 88.7%, 48.4%)',
        'helm-red': 'hsl(0, 84.2%, 60.2%)',
        'helm-green': 'hsl(142.1, 70.6%, 45.3%)',
        'helm-grey': 'hsl(240, 3.8%, 46.1%)',
      }
    }
  }
}
```

---

**Last Updated**: October 2024  
**Version**: 1.0  
**Status**: Active
