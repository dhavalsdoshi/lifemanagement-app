use tauri::Manager;

/// Read a section's JSON array from `dir/<key>.json`.
/// Returns an empty array if the file does not exist.
pub fn read_section_from_dir(dir: &std::path::Path, key: &str) -> Result<serde_json::Value, String> {
    let path = dir.join(format!("{}.json", key));
    if !path.exists() {
        return Ok(serde_json::Value::Array(vec![]));
    }
    let raw = std::fs::read_to_string(&path).map_err(|e| e.to_string())?;
    serde_json::from_str(&raw).map_err(|e| e.to_string())
}

/// Write a section's JSON value to `dir/<key>.json`, creating `dir` if needed.
/// Returns an error if `key` contains path separators or `..` components.
pub fn write_section_to_dir(dir: &std::path::Path, key: &str, data: serde_json::Value) -> Result<(), String> {
    // Reject keys that could escape the data directory
    let key_path = std::path::Path::new(key);
    if key_path.components().count() != 1 {
        return Err(format!("invalid section key: {}", key));
    }
    std::fs::create_dir_all(dir).map_err(|e| e.to_string())?;
    let path = dir.join(format!("{}.json", key));
    std::fs::write(&path, serde_json::to_string_pretty(&data).unwrap())
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn read_section(app: tauri::AppHandle, key: String) -> Result<serde_json::Value, String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    read_section_from_dir(&data_dir.join("data"), &key)
}

#[tauri::command]
fn write_section(app: tauri::AppHandle, key: String, data: serde_json::Value) -> Result<(), String> {
    let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    write_section_to_dir(&data_dir.join("data"), &key, data)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![read_section, write_section])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    fn tmp() -> TempDir {
        tempfile::tempdir().unwrap()
    }

    #[test]
    fn read_missing_key_returns_empty_array() {
        let dir = tmp();
        let result = read_section_from_dir(dir.path(), "weekly-goals").unwrap();
        assert_eq!(result, serde_json::json!([]));
    }

    #[test]
    fn write_then_read_roundtrip() {
        let dir = tmp();
        let data = serde_json::json!([{"id": "1", "goal": "Run 5k"}]);
        write_section_to_dir(dir.path(), "weekly-goals", data.clone()).unwrap();
        let read_back = read_section_from_dir(dir.path(), "weekly-goals").unwrap();
        assert_eq!(read_back, data);
    }

    #[test]
    fn write_creates_subdirectory_automatically() {
        let dir = tmp();
        let nested = dir.path().join("deep").join("nested");
        write_section_to_dir(&nested, "budget", serde_json::json!([])).unwrap();
        assert!(nested.join("budget.json").exists());
    }

    #[test]
    fn write_overwrites_existing_file() {
        let dir = tmp();
        write_section_to_dir(dir.path(), "habits", serde_json::json!([{"id": "1"}])).unwrap();
        write_section_to_dir(dir.path(), "habits", serde_json::json!([{"id": "2"}])).unwrap();
        let result = read_section_from_dir(dir.path(), "habits").unwrap();
        assert_eq!(result[0]["id"], "2");
    }

    #[test]
    fn read_corrupt_json_returns_error() {
        let dir = tmp();
        std::fs::write(dir.path().join("bad.json"), "not json").unwrap();
        let result = read_section_from_dir(dir.path(), "bad");
        assert!(result.is_err());
    }

    #[test]
    fn key_with_path_separator_is_rejected() {
        let dir = tmp();
        let result = write_section_to_dir(dir.path(), "../escape", serde_json::json!([]));
        assert!(result.is_err(), "path traversal key should be rejected with Err");
    }

    #[test]
    fn key_with_slash_is_rejected() {
        let dir = tmp();
        let result = write_section_to_dir(dir.path(), "foo/bar", serde_json::json!([]));
        assert!(result.is_err(), "key with slash should be rejected");
    }
}
