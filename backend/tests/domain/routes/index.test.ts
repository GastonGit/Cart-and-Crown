import { routeSchema } from "../../../src/domain/router/schemas";
import { routes } from "../../../src/globalconfig";
import { z } from "zod";

test("routes are valid", () => {
  const routesSchema = z.array(routeSchema);
  expect(() => {
    routesSchema.parse(routes);
  }).not.toThrow();
});
