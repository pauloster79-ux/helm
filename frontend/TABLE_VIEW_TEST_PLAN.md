# 📊 **Table View Test Plan**

## 🎯 **Testing the New Table View Feature**

### **Test Environment**
- **URL**: `http://localhost:5173/projects`
- **Browser**: Chrome/Firefox/Safari
- **Test User**: Any authenticated user with projects

---

## 📋 **Test Scenarios**

### **1. View Selector Tests**

#### **1.1 View Switching**
- [ ] Navigate to `/projects` page
- [ ] Verify default view is "Cards"
- [ ] Click "Table" button in view selector
- [ ] Verify view switches to table layout
- [ ] Click "Cards" button
- [ ] Verify view switches back to card layout
- [ ] Verify view selector shows current mode

#### **1.2 View Selector UI**
- [ ] Verify view selector has proper styling
- [ ] Verify active view is highlighted
- [ ] Verify hover effects work on buttons
- [ ] Verify icons display correctly (grid for cards, table for table)
- [ ] Verify project count displays correctly

---

### **2. Table View Tests**

#### **2.1 Table Layout**
- [ ] Verify table displays all projects
- [ ] Verify table has proper columns: Name, Status, Description, Created, Updated, Actions
- [ ] Verify table is responsive (horizontal scroll on mobile)
- [ ] Verify table has proper spacing and borders
- [ ] Verify table header is sticky/fixed

#### **2.2 Table Content**
- [ ] Verify project names display correctly
- [ ] Verify status badges show with correct colors and icons
- [ ] Verify descriptions are truncated with tooltips
- [ ] Verify dates display in both absolute and relative format
- [ ] Verify project IDs are truncated (first 8 characters)

#### **2.3 Table Interactions**
- [ ] Click on table row → Should open project detail modal
- [ ] Hover over table row → Should show hover effect
- [ ] Click edit button → Should open edit modal
- [ ] Click delete button → Should show confirmation modal
- [ ] Verify buttons don't trigger row click

---

### **3. Sorting Tests**

#### **3.1 Sortable Columns**
- [ ] Click "Project Name" header → Should sort alphabetically
- [ ] Click "Status" header → Should sort by status
- [ ] Click "Created" header → Should sort by creation date
- [ ] Click "Updated" header → Should sort by update date
- [ ] Verify "Description" column is not sortable

#### **3.2 Sort Direction**
- [ ] Click column header once → Should sort ascending
- [ ] Click same column header again → Should sort descending
- [ ] Click different column → Should reset to ascending
- [ ] Verify sort icons show correct direction
- [ ] Verify sort state persists when switching views

#### **3.3 Sort Functionality**
- [ ] Test sorting with 10+ projects
- [ ] Verify alphabetical sorting works correctly
- [ ] Verify date sorting works correctly
- [ ] Verify status sorting works correctly
- [ ] Test sorting with mixed data types

---

### **4. Responsive Design Tests**

#### **4.1 Desktop (1920px+)**
- [ ] Verify table displays all columns
- [ ] Verify proper spacing and alignment
- [ ] Verify hover effects work correctly
- [ ] Verify sorting works smoothly

#### **4.2 Tablet (768px - 1024px)**
- [ ] Verify table is horizontally scrollable
- [ ] Verify important columns are visible
- [ ] Verify touch interactions work
- [ ] Verify view selector is accessible

#### **4.3 Mobile (375px - 767px)**
- [ ] Verify table scrolls horizontally
- [ ] Verify essential information is visible
- [ ] Verify touch targets are large enough
- [ ] Verify view selector works on mobile

---

### **5. Functionality Tests**

#### **5.1 CRUD Operations in Table View**
- [ ] Create new project → Verify appears in table
- [ ] Edit project from table → Verify changes reflect
- [ ] Delete project from table → Verify removal
- [ ] Verify all operations work same as card view

#### **5.2 Modal Interactions**
- [ ] Click project row → Opens detail modal
- [ ] Click edit button → Opens edit modal
- [ ] Click delete button → Shows confirmation
- [ ] Verify modals work correctly from table view

#### **5.3 State Management**
- [ ] Switch between views → Verify data consistency
- [ ] Perform operations in table view → Verify card view updates
- [ ] Perform operations in card view → Verify table view updates
- [ ] Verify loading states work in both views

---

### **6. Edge Cases**

#### **6.1 Empty State**
- [ ] Delete all projects
- [ ] Verify empty state message in table view
- [ ] Verify empty state is consistent with card view
- [ ] Verify "Create Project" button works

#### **6.2 Large Data Sets**
- [ ] Create 20+ projects
- [ ] Verify table performance
- [ ] Verify sorting performance
- [ ] Verify horizontal scroll works

#### **6.3 Long Content**
- [ ] Create project with very long name
- [ ] Create project with very long description
- [ ] Verify table handles long content gracefully
- [ ] Verify truncation works correctly

---

### **7. Performance Tests**

#### **7.1 Loading Performance**
- [ ] Verify table loads quickly
- [ ] Verify sorting is responsive
- [ ] Verify view switching is smooth
- [ ] Verify no lag with many projects

#### **7.2 Memory Usage**
- [ ] Monitor memory usage with many projects
- [ ] Verify no memory leaks when switching views
- [ ] Verify efficient re-rendering

---

### **8. Accessibility Tests**

#### **8.1 Keyboard Navigation**
- [ ] Tab through table elements
- [ ] Use arrow keys to navigate
- [ ] Verify focus indicators are visible
- [ ] Verify keyboard shortcuts work

#### **8.2 Screen Reader**
- [ ] Verify table has proper ARIA labels
- [ ] Verify column headers are announced
- [ ] Verify sort states are announced
- [ ] Verify actions are accessible

---

### **9. Cross-Browser Tests**

#### **9.1 Chrome**
- [ ] Verify all functionality works
- [ ] Verify styling is consistent
- [ ] Verify performance is good

#### **9.2 Firefox**
- [ ] Verify all functionality works
- [ ] Verify styling is consistent
- [ ] Verify performance is good

#### **9.3 Safari**
- [ ] Verify all functionality works
- [ ] Verify styling is consistent
- [ ] Verify performance is good

---

### **10. Integration Tests**

#### **10.1 View Persistence**
- [ ] Switch to table view
- [ ] Navigate away and back
- [ ] Verify view preference is remembered
- [ ] Verify data is consistent

#### **10.2 Real-time Updates**
- [ ] Open two browser tabs
- [ ] Create project in one tab
- [ ] Verify appears in table view in other tab
- [ ] Test with multiple users (if possible)

---

## ✅ **Success Criteria**

### **All tests must pass:**
1. ✅ View selector works smoothly
2. ✅ Table view displays all data correctly
3. ✅ Sorting works on all sortable columns
4. ✅ All CRUD operations work in table view
5. ✅ Responsive design works on all devices
6. ✅ Performance is acceptable with large datasets
7. ✅ Accessibility standards are met
8. ✅ Cross-browser compatibility is maintained

---

## 🚀 **Test Execution**

### **Manual Testing Steps:**
1. **Start the app**: `npm run dev` in frontend directory
2. **Login**: Use Google OAuth
3. **Navigate to projects**: Go to `/projects` page
4. **Run through each test scenario** above
5. **Document any issues** found
6. **Verify all success criteria** are met

---

## 📝 **Test Results**

### **Date**: ___________
### **Tester**: ___________
### **Browser**: ___________
### **Issues Found**: ___________
### **Overall Status**: ✅ PASS / ❌ FAIL

---

**Note**: This test plan covers the complete table view functionality. Each checkbox should be tested and marked as complete before considering the feature ready for production.
