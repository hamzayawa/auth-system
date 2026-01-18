INSERT INTO role (id, name, description)
VALUES
  ('role-user', 'user', 'Standard user'),
  ('role-admin', 'admin', 'Administrator'),
  ('role-superadmin', 'superadmin', 'Super administrator')
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION sync_user_role_on_insert()
RETURNS trigger AS $$
DECLARE
  target_role_name text;
  target_role_id   text;
BEGIN
  target_role_name := COALESCE(NEW.role, 'user');

  SELECT id INTO target_role_id
  FROM role
  WHERE name = target_role_name;

  IF target_role_id IS NOT NULL THEN
    INSERT INTO user_role (user_id, role_id)
    VALUES (NEW.id, target_role_id)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_insert_sync_role
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION sync_user_role_on_insert();

CREATE OR REPLACE FUNCTION sync_user_role_on_update()
RETURNS trigger AS $$
DECLARE
  new_role_id text;
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    DELETE FROM user_role WHERE user_id = NEW.id;

    SELECT id INTO new_role_id
    FROM role
    WHERE name = NEW.role;

    IF new_role_id IS NOT NULL THEN
      INSERT INTO user_role (user_id, role_id)
      VALUES (NEW.id, new_role_id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_update_sync_role
AFTER UPDATE OF role ON "user"
FOR EACH ROW
EXECUTE FUNCTION sync_user_role_on_update();

