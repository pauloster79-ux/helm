# 🔍 Why `filters` Dependency Caused Infinite Loop

## ❌ **The Problem:**

```typescript
// BEFORE - This caused infinite loop:
const fetchProposals = useCallback(async () => {
  // Uses filters in the query logic
  if (filters?.status) {
    query = query.in('status', filters.status);
  }
  // ... more filter logic
}, [projectId, componentId, componentType, filters]); // ❌ PROBLEM HERE!

useEffect(() => {
  fetchProposals();
}, [fetchProposals]); // This runs every time fetchProposals changes
```

## 🔄 **What Happened (Infinite Loop):**

1. **Component renders** → `filters` object is created
2. **`fetchProposals` recreated** → Because `filters` reference changed
3. **`useEffect` runs** → Because `fetchProposals` changed
4. **Component re-renders** → Due to state updates
5. **`filters` object recreated** → New reference
6. **Back to step 2** → INFINITE LOOP! 🔄

## 🎯 **Why `filters` Changes Every Render:**

```typescript
// In the parent component (AssistantPane):
const filters = {  // ❌ New object every render!
  status: ['pending'],
  component_type: ['task']
};

// Even if values are the same, object reference is different:
const filters1 = { status: ['pending'] };
const filters2 = { status: ['pending'] };
console.log(filters1 === filters2); // false! Different references
```

## ✅ **The Proper Fix:**

```typescript
// AFTER - Stable dependencies:
const filterDeps = useMemo(() => ({
  status: filters?.status,
  component_type: filters?.component_type,
  confidence: filters?.confidence,
  proposal_type: filters?.proposal_type,
  created_after: filters?.created_after,
  created_before: filters?.created_before,
}), [
  filters?.status,
  filters?.component_type,
  filters?.confidence,
  filters?.proposal_type,
  filters?.created_after,
  filters?.created_before,
]);

const fetchProposals = useCallback(async () => {
  // Same logic, but now uses stable filterDeps
}, [projectId, componentId, componentType, filterDeps]); // ✅ Stable!
```

## 🧠 **Why This Works:**

### **1. `useMemo` Stabilizes the Object:**
- Only recreates `filterDeps` when **actual filter values** change
- If filter values are the same, `filterDeps` keeps the same reference
- Prevents unnecessary `fetchProposals` recreations

### **2. Individual Dependencies:**
- `filters?.status` - Only changes when status filter changes
- `filters?.component_type` - Only changes when component type changes
- etc.

### **3. Stable References:**
- `filterDeps` reference stays the same between renders
- `fetchProposals` doesn't get recreated unnecessarily
- `useEffect` doesn't run infinitely

## 🎯 **Alternative Solutions:**

### **Option 1: Memoize in Parent Component**
```typescript
// In AssistantPane component:
const filters = useMemo(() => ({
  status: ['pending'],
  component_type: ['task']
}), []); // Only recreate when dependencies change
```

### **Option 2: Individual Filter Props**
```typescript
// Instead of filters object, pass individual props:
useProposals({
  projectId,
  statusFilter: ['pending'],
  componentTypeFilter: ['task']
});
```

### **Option 3: Ref Instead of State**
```typescript
// Use ref for filters that don't need to trigger re-renders:
const filtersRef = useRef({ status: ['pending'] });
```

## 🎉 **Best Practice:**

**Always be careful with object/array dependencies in useCallback/useEffect:**

```typescript
// ❌ BAD - Object recreated every render
const options = { enabled: true };
useEffect(() => { ... }, [options]);

// ✅ GOOD - Individual properties
useEffect(() => { ... }, [options.enabled]);

// ✅ GOOD - Memoized object
const memoizedOptions = useMemo(() => ({ enabled: true }), []);
useEffect(() => { ... }, [memoizedOptions]);
```

## 🔍 **How to Debug This:**

1. **Check console for "Maximum update depth exceeded"**
2. **Look for dependencies that are objects/arrays**
3. **Use React DevTools Profiler** to see re-renders
4. **Add console.log in useEffect** to see how often it runs

---

**The key lesson: Object references matter in React dependencies!** 🎯
