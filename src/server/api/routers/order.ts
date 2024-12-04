import { z } from "zod";
import { router, publicProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { OrderStatus } from "@prisma/client";

// Define shipping schema
const shippingSchema = z
  .object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    postalCode: z.string(),
  })
  .or(z.object({})); // Allow empty object for initial upload

export const orderRouter = router({
  create: publicProcedure
    .input(
      z.object({
        imageUrl: z.string().url(),
        price: z.number().positive(),
        currency: z.string(),
        locale: z.string(),
        language: z.string(),
        shipping: shippingSchema.default({}),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.order.create({
        data: {
          ...input,
          status: OrderStatus.UPLOADED,
          shipping: input.shipping || {},
        },
      });
    }),

  getById: publicProcedure.input(z.string()).query(async ({ input }) => {
    return prisma.order.findUnique({
      where: { id: input },
    });
  }),

  updateStatus: publicProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.nativeEnum(OrderStatus),
      })
    )
    .mutation(async ({ input }) => {
      return prisma.order.update({
        where: { id: input.id },
        data: { status: input.status },
      });
    }),

  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ input }) => {
      const items = await prisma.order.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: typeof input.cursor = undefined;
      if (items.length > input.limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return {
        items,
        nextCursor,
      };
    }),
});
