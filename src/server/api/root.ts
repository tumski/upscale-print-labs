import { router } from "@/server/api/trpc";
import { orderRouter } from "@/server/api/routers/order";

export const appRouter = router({
  order: orderRouter,
});

export type AppRouter = typeof appRouter;
