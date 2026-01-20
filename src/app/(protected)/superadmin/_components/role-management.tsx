"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ✅ PROPER TYPES for your API response structure
interface Permission {
  id: string;
  name: string;
  category: string;
}

interface RolePermission {
  id: string;
  permission: Permission; // nested!
}

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: RolePermission[]; // array of RolePermission, not Permission
}

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissionIds: [] as string[],
  });

  // Fetch roles and permissions
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [rolesRes, permsRes] = await Promise.all([
          fetch("/api/superadmin/roles"),
          fetch("/api/superadmin/permissions"),
        ]);

        if (!rolesRes.ok) throw new Error("Failed to fetch roles");
        if (!permsRes.ok) throw new Error("Failed to fetch permissions");

        const rolesData: Role[] = await rolesRes.json();
        const permsData: Permission[] = await permsRes.json();

        setRoles(rolesData);
        setPermissions(permsData);
      } catch (error) {
        toast.error("Failed to load data");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSelectPermission = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(id)
        ? prev.permissionIds.filter((pid) => pid !== id)
        : [...prev.permissionIds, id],
    }));
  };

  const handleSaveRole = async () => {
    if (!formData.name.trim()) {
      toast.error("Role name is required");
      return;
    }

    setIsSaving(true);
    try {
      const method = editingRoleId ? "PATCH" : "POST";
      const body = editingRoleId
        ? { roleId: editingRoleId, ...formData }
        : formData;

      const res = await fetch("/api/superadmin/roles", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save role");

      const savedRole: Role = await res.json();

      setRoles((prev) => {
        if (editingRoleId) {
          return prev.map((r) => (r.id === editingRoleId ? savedRole : r));
        }
        return [...prev, savedRole];
      });

      setFormData({ name: "", description: "", permissionIds: [] });
      setEditingRoleId(null);
      setIsCreateOpen(false);
      toast.success(
        `Role ${editingRoleId ? "updated" : "created"} successfully`,
      );
    } catch (error: any) {
      if (
        error.message.includes("already exists") ||
        error.message.includes("duplicate")
      ) {
        toast.error(
          `Role "${formData.name}" already exists. Try a different name.`,
        );
      } else {
        toast.error("Failed to save role");
      }
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRoleId(role.id);
    setFormData({
      name: role.name,
      description: role.description || "",
      permissionIds: role.permissions?.map((p) => p.permission.id) || [],
    });
    setIsCreateOpen(true);
  };

  const handleDeleteRole = async (roleId: string, roleName: string) => {
    if (["superadmin", "admin", "user"].includes(roleName)) {
      toast.error("Cannot delete default roles");
      return;
    }

    if (!confirm("Are you sure you want to delete this role?")) return;

    setIsSaving(true);
    try {
      const res = await fetch("/api/superadmin/roles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });

      if (!res.ok) throw new Error("Failed to delete role");

      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      toast.success("Role deleted successfully");
    } catch (error) {
      toast.error("Failed to delete role");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Role Management</CardTitle>
            <CardDescription>Create and manage system roles</CardDescription>
          </div>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence>
          {isCreateOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 space-y-4 rounded-lg border p-4"
            >
              <Input
                placeholder="Role name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Textarea
                placeholder="Role description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
              <div className="space-y-2 max-h-48 overflow-y-auto rounded-lg border p-2">
                {permissions.map((perm) => (
                  <div key={perm.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={perm.id}
                      checked={formData.permissionIds.includes(perm.id)}
                      onCheckedChange={() => handleSelectPermission(perm.id)}
                      disabled={isSaving}
                    />
                    <label
                      htmlFor={perm.id}
                      className="cursor-pointer flex-1 capitalize font-normal"
                    >
                      {perm.name} ({perm.category})
                    </label>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveRole} disabled={isSaving}>
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingRoleId ? "Update Role" : "Create Role"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingRoleId(null);
                    setFormData({
                      name: "",
                      description: "",
                      permissionIds: [],
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {roles.map((role, index) => (
            <motion.div
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1">
                <p className="font-medium capitalize">{role.name}</p>
                <p className="text-sm text-muted-foreground">
                  {role.description || "No description"}
                </p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {(role.permissions || []).map((p, permIndex) => (
                    <span
                      key={p.id || permIndex}
                      className="rounded bg-muted px-2 py-0.5 text-xs"
                    >
                      {p.permission?.name || "No perms"}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditRole(role)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteRole(role.id, role.name)}
                  disabled={
                    ["superadmin", "admin", "user"].includes(role.name) ||
                    isSaving
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
