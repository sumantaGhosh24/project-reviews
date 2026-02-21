import {ReactElement, ReactNode} from "react";
import {
  render,
  RenderOptions,
  queryHelpers,
  buildQueries,
} from "@testing-library/react";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ThemeProvider} from "next-themes";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders = ({children}: AllTheProvidersProps) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const queryAllByDataSlot = (container: HTMLElement, id: string) =>
  queryHelpers.queryAllByAttribute("data-slot", container, id);

const getMultipleError = (c: unknown, id: ReactNode) =>
  `Found multiple elements with data-slot: ${id}`;
const getMissingError = (c: unknown, id: ReactNode) =>
  `Unable to find an element with data-slot: ${id}`;

const [
  queryByDataSlot,
  getAllByDataSlot,
  getByDataSlot,
  findAllByDataSlot,
  findByDataSlot,
] = buildQueries(queryAllByDataSlot, getMultipleError, getMissingError);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) => render(ui, {wrapper: AllTheProviders, ...options});

export * from "@testing-library/react";
export {
  customRender as render,
  queryByDataSlot,
  getAllByDataSlot,
  getByDataSlot,
  findAllByDataSlot,
  findByDataSlot,
};
