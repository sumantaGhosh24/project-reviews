/* eslint-disable @typescript-eslint/no-explicit-any */
import "@testing-library/jest-dom";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {toHaveNoViolations} from "jest-axe";
import {TextDecoder, TextEncoder} from "util";

global.TextDecoder = TextDecoder as any;
global.TextEncoder = TextEncoder as any;

expect.extend(toHaveNoViolations);

jest.mock("better-auth", () => ({
  betterAuth: jest.fn(() => ({
    handler: jest.fn(),
    api: {
      getSession: jest.fn(),
    },
  })),
}));

jest.mock("better-auth/adapters/prisma", () => ({
  prismaAdapter: jest.fn(),
}));

jest.mock("better-auth/next-js", () => ({
  nextCookies: jest.fn(),
}));

jest.mock("better-auth/plugins", () => ({
  twoFactor: jest.fn(),
  admin: jest.fn(),
  createAuthMiddleware: jest.fn(),
}));

jest.mock("better-auth/plugins/access", () => ({
  createAccessControl: jest.fn(() => ({
    newRole: jest.fn((roleStatements) => ({
      statements: roleStatements,
      role: "mock-role",
    })),
  })),
}));

jest.mock("better-auth/plugins/admin/access", () => ({
  defaultStatements: {},
  userAc: {statements: {user: []}},
  adminAc: {statements: {}},
}));

jest.mock("@better-auth/passkey", () => ({
  passkey: jest.fn(),
}));

jest.mock("nuqs/server", () => ({
  __esModule: true,
  parseAsInteger: {
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  parseAsString: {
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  createLoader: jest.fn(() => jest.fn((params) => params)),
}));

jest.mock("@polar-sh/better-auth", () => ({
  polar: jest.fn(),
  checkout: jest.fn(),
  portal: jest.fn(),
  usage: jest.fn(),
}));

jest.mock("@tanstack/react-query", () => {
  const actual = jest.requireActual("@tanstack/react-query");

  return {
    __esModule: true,
    ...actual,
    useSuspenseQuery: jest.fn(actual.useSuspenseQuery),
    useQueryClient: jest.fn(actual.useQueryClient),
    useMutation: jest.fn(actual.useMutation),
    useQuery: jest.fn(actual.useQuery),
    QueryClient: actual.QueryClient,
    QueryClientProvider: actual.QueryClientProvider,
  };
});

jest.mock("@uiw/react-md-editor", () => ({
  __esModule: true,
  default: {
    Markdown: ({source}: {source: string}) => (
      <div data-testid="markdown">{source}</div>
    ),
  },
  Markdown: ({source}: {source: string}) => (
    <div data-testid="markdown">{source}</div>
  ),
}));

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: () => "",
  redirect: jest.fn(),
}));

jest.mock("next/dynamic", () => ({
  __esModule: true,
  default: (loader: any) => {
    const DynamicComponent = (props: any) => {
      const initialLoaded = (props as any).__loadedComponent as
        | ReactNode
        | undefined;
      const [Component, setComponent] = useState<any>(
        () => initialLoaded || null
      );

      useEffect(() => {
        if (Component) return;
        let mounted = true;
        loader().then((mod: any) => {
          if (!mounted) return;
          setComponent(() => mod.default?.Markdown || mod.default || mod);
        });
        return () => {
          mounted = false;
        };
      }, [Component]);

      if (!Component) return null;
      const LoadedComponent = Component as any;
      return <LoadedComponent {...props} />;
    };
    DynamicComponent.displayName = "DynamicComponent";
    return DynamicComponent;
  },
}));

jest.mock("next/link", () => {
  return function MockLink({
    children,
    href,
  }: {
    children: ReactNode;
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

jest.mock("embla-carousel-react", () => ({
  __esModule: true,
  default: jest.fn(() => [
    jest.fn(),
    {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
      scrollNext: jest.fn(),
      scrollPrev: jest.fn(),
      canScrollNext: jest.fn(() => true),
      canScrollPrev: jest.fn(() => true),
      scrollTo: jest.fn(),
      scrollSnapList: jest.fn(() => []),
      selectedScrollSnap: jest.fn(() => 0),
    },
  ]),
}));

jest.mock("lucide-react", () => {
  return new Proxy(
    {},
    {
      get: (target, name) => {
        if (name === "__esModule") return true;
        const Icon = (props: any) =>
          createElement("span", {
            ...props,
            "data-testid": `icon-${String(name)}`,
          });
        Icon.displayName = `Icon-${String(name)}`;
        return Icon;
      },
    }
  );
});

jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue({}),
}));

const mockSetTheme = jest.fn();
const useThemeMock = jest.fn(() => ({
  theme: "light",
  setTheme: mockSetTheme,
}));

jest.mock("next-themes", () => ({
  useTheme: useThemeMock,
  ThemeProvider: ({children}: {children: ReactNode}) => (
    <div data-testid="next-themes-provider">{children}</div>
  ),
}));

jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
  default: (props: any) => <img {...props} />,
}));

class ResizeObserverMock {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
}

(global as any).ResizeObserver = ResizeObserverMock;
if (typeof window !== "undefined") {
  (window as any).ResizeObserver = ResizeObserverMock;
}

jest.mock("@sentry/nextjs", () => ({
  captureException: jest.fn(),
}));

jest.mock("@/lib/auth/auth-client", () => ({
  authClient: {
    useSession: jest.fn(() => ({data: null})),
    signIn: {
      passkey: jest.fn(),
      email: jest.fn(),
      social: jest.fn(),
    },
    signOut: jest.fn(),
    signUp: {
      email: jest.fn(),
    },
    checkout: jest.fn(),
    sendVerificationEmail: jest.fn(),
    requestPasswordReset: jest.fn(),
    getSession: jest.fn(),
    resetPassword: jest.fn(),
    deleteUser: jest.fn(),
    linkSocial: jest.fn(),
    unlinkAccount: jest.fn(),
    changePassword: jest.fn(),
    updateUser: jest.fn(),
    changeEmail: jest.fn(),
    revokeOtherSessions: jest.fn(),
    revokeSession: jest.fn(),
    impersonateUser: jest.fn(),
    banUser: jest.fn(),
    unbanUser: jest.fn(),
    revokeUserSessions: jest.fn(),
    removeUser: jest.fn(),
    admin: {
      enable: jest.fn(),
      disable: jest.fn(),
      hasPermission: jest.fn(),
      stopImpersonating: jest.fn(),
      impersonateUser: jest.fn(),
      banUser: jest.fn(),
      unbanUser: jest.fn(),
      revokeUserSessions: jest.fn(),
      removeUser: jest.fn(),
    },
    customer: {
      portal: jest.fn(),
      state: jest.fn(),
    },
    twoFactor: {
      enable: jest.fn(),
      disable: jest.fn(),
      verifyBackupCode: jest.fn(),
      verifyTotp: jest.fn(),
    },
    passkey: {
      addPasskey: jest.fn(),
      deletePasskey: jest.fn(),
    },
  },
}));

jest.mock("@/lib/auth/auth", () => ({
  auth: {
    api: {
      getSession: jest.fn(),
      listUserAccounts: jest.fn(),
      listSessions: jest.fn(),
      listPasskeys: jest.fn(),
      userHasPermission: jest.fn(),
      listUsers: jest.fn(),
    },
  },
}));

jest.mock("@/lib/polar", () => ({
  polarClient: {
    customers: {
      getStateExternal: jest.fn(),
    },
  },
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock("rehype-sanitize", () => ({
  __esModule: true,
  default: () => ({}),
}));

jest.mock("superjson", () => ({
  serialize: jest.fn((val) => ({json: val})),
  deserialize: jest.fn((val) => val.json),
  stringify: jest.fn((val) => JSON.stringify(val)),
  parse: jest.fn((val) => JSON.parse(val)),
  registerClass: jest.fn(),
  registerCustom: jest.fn(),
}));

jest.mock("nuqs", () => ({
  useQueryState: jest.fn(() => ["", jest.fn()]),
  useQueryStates: jest.fn((config) => [
    Object.keys(config).reduce((acc, key) => ({...acc, [key]: ""}), {}),
    jest.fn(),
  ]),
  createSerializer: jest.fn(() => jest.fn()),
  parseAsString: {
    parse: (v: string) => v,
    serialize: (v: string) => v,
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  parseAsInteger: {
    parse: (v: string) => parseInt(v),
    serialize: (v: string) => v.toString(),
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  parseAsBoolean: {
    parse: (v: string) => v === "true",
    serialize: (v: string) => v.toString(),
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
}));

jest.mock("nuqs/server", () => ({
  parseAsString: {
    parse: (v: string) => v,
    serialize: (v: string) => v,
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  parseAsInteger: {
    parse: (v: string) => parseInt(v),
    serialize: (v: string) => v.toString(),
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
  parseAsBoolean: {
    parse: (v: string) => v === "true",
    serialize: (v: string) => v.toString(),
    withDefault: jest.fn().mockReturnThis(),
    withOptions: jest.fn().mockReturnThis(),
  },
}));

jest.mock("nuqs/adapters/next/app", () => ({
  NuqsAdapter: ({children}: {children: ReactNode}) => (
    <div data-testid="nuqs-adapter">{children}</div>
  ),
}));

jest.mock("@/trpc/client", () => {
  const useTRPC = jest.fn(() => ({
    notification: {
      notificationCount: {
        queryOptions: jest.fn(() => ({
          queryKey: ["notificationCount"],
          queryFn: jest.fn().mockResolvedValue(0),
        })),
      },
      getAll: {
        queryOptions: jest.fn(() => ({
          queryKey: ["notifications"],
          queryFn: jest.fn().mockResolvedValue([]),
        })),
      },
    },
  }));

  const TRPCReactProvider = ({children}: {children: ReactNode}) => (
    <div data-testid="trpc-provider">{children}</div>
  );

  return {
    useTRPC,
    TRPCReactProvider,
  };
});

jest.mock("@/trpc/server", () => ({
  HydrateClient: ({children}: {children: ReactNode}) => (
    <div data-testid="hydrate-client">{children}</div>
  ),
  prefetch: jest.fn(),
  trpc: {
    category: {
      getAllPaginated: {
        queryOptions: jest.fn((params) => ({
          queryKey: ["getAllPaginated", params],
        })),
      },
      getAll: {
        queryOptions: jest.fn(() => ({queryKey: ["getAll"]})),
      },
      getOne: {
        queryOptions: jest.fn((params) => ({queryKey: ["getOne", params]})),
      },
    },
    comment: {
      getAll: {
        queryOptions: jest.fn((params) => ({queryKey: ["getAll", params]})),
      },
      getMyAll: {
        queryOptions: jest.fn((params) => ({queryKey: ["getMyAll", params]})),
      },
    },
    notification: {
      getAll: {
        queryOptions: jest.fn((params) => ({queryKey: ["getAll", params]})),
      },
    },
    review: {
      getAll: {queryOptions: jest.fn()},
      getMyAll: {queryOptions: jest.fn()},
    },
  },
}));

jest.mock("@/lib/db", () => {
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      count: jest.fn(),
    },
    view: {
      count: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    review: {
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      aggregate: jest.fn(),
    },
    category: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    project: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      deleteMany: jest.fn(),
    },
    release: {
      create: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    comment: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    notification: {
      create: jest.fn(),
      findMany: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
      createMany: jest.fn(),
    },
    vote: {
      count: jest.fn(),
      groupBy: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      create: jest.fn(),
    },
    follow: {
      findUnique: jest.fn(),
      count: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    image: {
      create: jest.fn(),
      delete: jest.fn(),
      deleteMany: jest.fn(),
      findMany: jest.fn(),
    },
  };

  (mockPrisma as any).$transaction = jest.fn(
    (cb: (db: typeof mockPrisma) => any) => cb(mockPrisma)
  );

  return {
    __esModule: true,
    default: mockPrisma,
  };
});

jest.mock("@/lib/uploadthing", () => ({
  useUploadThing: jest.fn(),
}));
jest.mock("@/components/ui/tabs", () => {
  const TabsContext = createContext<{
    value: string;
    setValue: (value: string) => void;
  } | null>(null);

  const Tabs = ({
    defaultValue,
    value,
    onValueChange,
    children,
  }: {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }) => {
    const [internalValue, setInternalValue] = useState<string>(
      value ?? defaultValue ?? ""
    );

    const currentValue = value ?? internalValue;

    const setValue = (next: string) => {
      setInternalValue(next);
      onValueChange?.(next);
    };

    return (
      <TabsContext.Provider value={{value: currentValue, setValue}}>
        <div>{children}</div>
      </TabsContext.Provider>
    );
  };

  const TabsList = ({children}: {children: ReactNode}) => (
    <div role="tablist">{children}</div>
  );

  const TabsTrigger = ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => {
    const ctx = useContext(TabsContext);
    const selected = ctx?.value === value;

    return (
      <button
        role="tab"
        aria-selected={selected}
        onClick={() => ctx?.setValue(value)}
      >
        {children}
      </button>
    );
  };

  const TabsContent = ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => {
    const ctx = useContext(TabsContext);
    if (ctx?.value !== value) return null;
    return <div>{children}</div>;
  };

  return {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
  };
});

jest.mock("@/components/ui/select", () => ({
  Select: ({children, onValueChange, defaultValue, name}: any) => (
    <select
      data-testid="select-rating"
      defaultValue={defaultValue}
      onChange={(e) => onValueChange(e.target.value)}
      id={name}
      aria-label="Review Rating"
    >
      {children}
    </select>
  ),
  SelectTrigger: ({children}: {children: ReactNode}) => <>{children}</>,
  SelectValue: ({placeholder}: any) => <option disabled>{placeholder}</option>,
  SelectContent: ({children}: {children: ReactNode}) => <>{children}</>,
  SelectItem: ({value, children}: any) => (
    <option value={value}>{children}</option>
  ),
}));

jest.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({children}: {children: ReactNode}) => <div>{children}</div>,
  DropdownMenuTrigger: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({children}: {children: ReactNode}) => (
    <div data-testid="dropdown-content">{children}</div>
  ),
  DropdownMenuItem: ({children, onClick, variant}: any) => (
    <button onClick={onClick} data-variant={variant}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
}));

jest.mock("@/components/ui/alert-dialog", () => ({
  AlertDialog: ({children}: {children: ReactNode}) => (
    <div data-testid="alert-dialog">{children}</div>
  ),
  AlertDialogTrigger: ({
    children,
    className,
  }: {
    children: ReactNode;
    className?: string;
  }) => (
    <div data-testid="alert-dialog-trigger" className={className}>
      {children}
    </div>
  ),
  AlertDialogContent: ({children}: {children: ReactNode}) => (
    <div data-testid="alert-dialog-content">{children}</div>
  ),
  AlertDialogHeader: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  AlertDialogTitle: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  AlertDialogDescription: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  AlertDialogFooter: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  AlertDialogCancel: ({children}: {children: ReactNode}) => (
    <button>{children}</button>
  ),
  AlertDialogAction: ({children, onClick, disabled, className}: any) => (
    <button
      data-testid="alert-dialog-action"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  ),
}));

jest.mock("@/components/ui/card", () => ({
  Card: ({children}: {children: ReactNode}) => <div>{children}</div>,
  CardHeader: ({children}: {children: ReactNode}) => <div>{children}</div>,
  CardTitle: ({children}: {children: ReactNode}) => <div>{children}</div>,
  CardDescription: ({children}: {children: ReactNode}) => <div>{children}</div>,
  CardContent: ({children}: {children: ReactNode}) => <div>{children}</div>,
  CardFooter: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

jest.mock("@/components/ui/spinner", () => ({
  Spinner: () => (
    <div data-testid="spinner">
      <span data-testid="icon-Loader2Icon" />
    </div>
  ),
}));

jest.mock("@/components/ui/navigation-menu", () => ({
  NavigationMenu: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu">{children}</div>
  ),
  NavigationMenuList: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu-list">{children}</div>
  ),
  NavigationMenuItem: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu-item">{children}</div>
  ),
  NavigationMenuTrigger: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu-trigger">{children}</div>
  ),
  NavigationMenuContent: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu-content">{children}</div>
  ),
  NavigationMenuLink: ({children}: {children: ReactNode}) => (
    <div data-testid="navigation-menu-link">{children}</div>
  ),
  navigationMenuTriggerStyle: () => "",
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({children, onClick}: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  buttonVariants: jest.fn(() => ""),
}));

jest.mock("@/components/ui/field", () => ({
  Field: ({children}: {children: ReactNode}) => <div>{children}</div>,
  FieldError: ({errors}: any) => (
    <div>{errors?.map((e: any) => e?.message)}</div>
  ),
  FieldGroup: ({children}: {children: ReactNode}) => <div>{children}</div>,
  FieldLabel: ({children, htmlFor}: any) => (
    <label htmlFor={htmlFor}>{children}</label>
  ),
}));

jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input {...props} />,
}));

jest.mock("@/components/ui/textarea", () => ({
  Textarea: (props: any) => <textarea {...props} />,
}));

jest.mock("@/components/ui/button", () => ({
  Button: ({children, variant, className, ...props}: any) => {
    const classes = [className];
    if (variant === "success") classes.push("bg-success");
    if (variant === "destructive") classes.push("bg-destructive");
    return (
      <button {...props} className={classes.filter(Boolean).join(" ")}>
        {children}
      </button>
    );
  },
  buttonVariants: jest.fn(({variant}: {variant?: string} = {}) => {
    if (variant === "success") return "bg-success";
    if (variant === "destructive") return "bg-destructive";
    return "";
  }),
}));

jest.mock("@/components/ui/avatar", () => ({
  Avatar: ({children}: {children: ReactNode}) => (
    <div data-testid="avatar" data-slot="avatar">
      {children}
    </div>
  ),
  AvatarGroup: ({children}: {children: ReactNode}) => (
    <div data-testid="avatar-group">{children}</div>
  ),
  AvatarGroupCount: ({children}: {children: ReactNode}) => (
    <div data-testid="avatar-group-count">{children}</div>
  ),
  // eslint-disable-next-line @next/next/no-img-element
  AvatarImage: ({src}: any) => <img src={src} alt="avatar" />,
  AvatarFallback: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

jest.mock("@/components/ui/drawer", () => ({
  Drawer: ({children}: {children: ReactNode}) => (
    <div data-testid="drawer">{children}</div>
  ),
  DrawerTrigger: ({children, onClick}: any) => (
    <button data-testid="drawer-trigger" onClick={onClick}>
      {children}
    </button>
  ),
  DrawerContent: ({children}: {children: ReactNode}) => (
    <div data-testid="drawer-content">{children}</div>
  ),
  DrawerHeader: ({children}: {children: ReactNode}) => <div>{children}</div>,
  DrawerTitle: ({children}: {children: ReactNode}) => <div>{children}</div>,
  DrawerDescription: ({children}: {children: ReactNode}) => (
    <div>{children}</div>
  ),
  DrawerFooter: ({children}: {children: ReactNode}) => <div>{children}</div>,
  DrawerClose: ({children}: {children: ReactNode}) => <div>{children}</div>,
}));

jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div data-testid="skeleton" data-slot="skeleton" />,
}));
