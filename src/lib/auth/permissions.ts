import {createAccessControl} from "better-auth/plugins/access";
import {
  defaultStatements,
  userAc,
  adminAc,
} from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  category: ["create", "update", "delete"],
};

export const ac = createAccessControl(statement);

export const user = ac.newRole({
  ...userAc.statements,
  user: [...userAc.statements.user, "list"],
});

export const admin = ac.newRole({
  category: ["create", "update", "delete"],
  ...adminAc.statements,
});
