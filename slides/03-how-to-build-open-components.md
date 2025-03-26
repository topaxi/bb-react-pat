# How to build

# (more complex)

# Open Components

---

## Let's build an Accordion

---

### Example Accordion Spec

- Collapsible panes
- Only a single pane can be open
- An event is called when a pane is selected (opened)

---

### Some helpers first!

```tsx [2-9|2-8|3|5-7|11-24|12-16|18-23|26-38|27|28|29|31-35|37]
export function composeEventHandlers(providedEventHandler, ourEventHandler) {
  return function wrappedEventHandler(event) {
    providedEventHandler?.(event);

    if (!event.defaultPrevented) {
      return ourEventHandler?.(event);
    }
  };
}

export function useCallbackRef(callback) {
  let callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () =>
      (...args) =>
        callbackRef.current?.(...args),
    [],
  );
}

export function useControlledState(controlledValue, defaultValue) {
  let [internalValue, setInternalValue] = useState(defaultValue);
  let isControlled = controlledValue !== undefined;
  let value = isControlled ? controlledValue : internalValue;

  let setValue = useCallbackRef((newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
  });

  return [value, setValue];
}
```

---

## useAccordion()

- Start headless, with a hook
  - manages state
  - sets up event handlers
  - returns props and event handlers for elements

---

## useAccordion() Interfaces

```tsx [1-3|5-9|12-14|16-26|17|18-21|22-25|28-30]
interface UseAccordionItem {
  readonly value: string | number;
}

interface UseAccordionProps<Item extends UseAccordionItem> {
  items: readonly Item[];
  selected?: Item;
  defaultSelected?: Item;
  onSelect?: (event: React.SyntheticEvent, item: Item) => unknown;
}

interface UseAccordionState<Item extends UseAccordionItem> {
  items: readonly Item[];
  selected: Item | null;
}

interface UseAccordionApi<Item extends UseAccordionItem> {
  getContainerProps: (props: React.HTMLAttributes) => React.HTMLAttributes;
  getItemProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
  getItemTriggerProps: (
    item: Item,
    props: React.HTMLAttributes,
  ) => React.HTMLAttributes;
}

interface UseAccordion<Item extends UseAccordionItem>
  extends UseAccordionState<Item>,
    UseAccordionApi<Item> {}







// padded to center last focused lines
```

---

## useAccordion()

```tsx [|1|2-3|5-8|10|12-20|19|22|51|24|26-28|29-37|38-49]
function useAccordion<T>(props: UseAccordionProps<T>): UseAccordion<T> {
  let autoId = useId();
  let id = props.id || autoId;

  let [selected, setSelected] = useControlledState(
    props.selected,
    props.defaultSelected,
  );

  let onSelect = useCallbackRef(props.onSelect);

  let handleSelect = useCallback(
    (item) => {
      return (_event) => {
        setSelected(item);
        onSelect(item);
      };
    },
    [setSelected, onSelect],
  );

  return useMemo(
    () => ({
      selected: selected ?? null,

      getContainerProps(props) {
        return { id };
      },
      getItemProps(item, props) {
        return {
          id: `${id}-item`,
          "data-state": selected.value === item.value ?
            "open" :
            "closed",
          ...props,
        };
      },
      getItemTriggerProps(item, props) {
        return {
          id: `${id}-trigger`,
          "aria-controls": `${id}-item`,
          "aria-expanded": selected.value === item.value,
          ...props,
          onClick: composeEventHandlers(
            props.onClick,
            handleSelect(item)
          ),
        };
      },
    }),
    [id, selected, onSelect, handleSelect],
  );
}
```

---

### useAccordion() Summary

- Internal implementation using state, reducers or state machines
- Allow controlled states to be uncontrolled
- Expose getters for props for each element
- Getters should merge incoming props with the returned props
- Represent states with `aria-` or `data-` attributes
- Compose event handlers and allow preventDefault to cancel the
  implementations default behavior

---

## Accordion Context

---

- Separate context values which change frequently and which change rarely.<br><small>(Does not fully apply in this example, as API always changes based on selected)</small>

```tsx [1-4,9-10|6-7,11-16]
export const AccordionStateContext =
  createContext<UseAccordionState<unknown>>({
    selected: null,
  });

export const useAccordionState =
  () => useContext(AccordionStateContext);

export const AccordionApiContext =
  createContext<UseAccordionApi<unknown> | null>(null);

export const useAccordionApi = () => {
  let api = useContext(AccordionApiContext);
  if (api == null)
    throw new Error('Must be used within Accordion.Root');
  return api;
}
```

---

## Accordion Elements

```tsx
interface AccordionContainerProps<T>
  extends
    React.HTMLAttributes<HTMLDivElement>,
    UseAccordionProps<T> {}

function AccordionContainer<T>(props: AccordionContainerProps) {
  let {
    items,
    selected,
    defaultSelected,
    onSelect,
    className,
    ...rest
  } = props;

  let { selected, ...api } =
    useAccordion({ items, selected, defaultSelected, onSelect });

  return (
    <AccordionApiContext.Provider value={api}>
      <AccordionStateContext.Provider value={{ selected }}>
       <div
         className={`my-accordion ${className}`}
         {...api.getContainerProps(rest)}
       />
    </AccordionApiContext.Provider>
  );
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
}

function AccordionItem({ value, ...rest }) {
  let api = useAccordionApi();

  return (
    <div
      {...api.getItemProps(item, rest)}
      className={`my-accordion__item ${rest.className}`}
    />
  );
}

interface AccordionItemTrigger(props) {
  let api = useAccordionApi();

  return (
    <button
      {...api.getItemTriggerProps(item, props)}
      className={`my-accordion__item-trigger ${props.className}`}
    />
  );
}
```

---

### Accordion Component Summary

- Create components for each individual "part" / element
- Allow each component to overwrite their rendered element (ala Radix `asChild`)
- Use context provider(s) within the Root node to pass down the exposed API
  (state, props getters, imperative functions like state setters, event handlers,
  etc.) by the hook.
  - Split into at least two providers
    1. That never or rarely changes (eg. event dispatchers, state setters)
    2. That changes frequently (eg. state)
