// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn read_iso_serial(iso_path: &str) -> Result<String, String> {
    use iso9660::{DirectoryEntry, ISO9660};
    use std::fs::File;
    use std::io::Read;

    let file = match File::open(iso_path) {
        Ok(file) => file,
        Err(_) => return Err(format!("Failed to open file {}", iso_path)),
    };
    let fs = match ISO9660::new(file) {
        Ok(fs) => fs,
        Err(_) => return Err(format!("Failed to read file {} as ISO9660", iso_path)),
    };

    match fs.open("SYSTEM.CNF") {
        Ok(Some(DirectoryEntry::File(file))) => {
            let mut raw = Vec::new();
            match file.read().read_to_end(&mut raw) {
                Err(_) => return Err(format!("Failed to read {} SYSTEM.CNF content", iso_path)),
                _ => {}
            };

            let config = match String::from_utf8(raw) {
                Ok(config) => config,
                Err(_) => {
                    return Err(format!(
                        "Failed to parse {} SYSTEM.CNF content as UTF-8",
                        iso_path
                    ))
                }
            };

            let serial = config.split("\\").collect::<Vec<_>>()[1]
                .split(";")
                .collect::<Vec<_>>()[0]
                .replace(".", "")
                .replace("_", "-");

            Ok(serial)
        }
        _ => Err(format!("{} SYSTEM.CNF is not found", iso_path)),
    }
}

#[derive(serde::Serialize, serde::Deserialize)]
struct Game {
    serial: String,
    path: String,
    name: Option<String>,
}

#[tauri::command]
fn read_directory_games(path: &str) -> Result<Vec<Game>, String> {
    use walkdir::WalkDir;

    // Get all files that end with .iso in the directory
    let mut iso_files = WalkDir::new(path)
        .into_iter()
        .filter_map(|entry| {
            let entry = entry.ok()?;
            let path = entry.path();
            if path.is_file() && path.extension()? == "iso" {
                Some(path.to_str()?.to_string())
            } else {
                None
            }
        })
        .collect::<Vec<_>>();

    let mut games = Vec::new();

    // Read the serial from the iso
    for file in iso_files.iter_mut() {
        let serial = read_iso_serial(file)?;

        games.push(Game {
            serial,
            path: file.to_string(),
            name: None,
        });
    }

    Ok(games)
}

#[tauri::command]
fn launch_game(pcsx2_path: &str, iso_path: &str, flags: Vec<String>, game_args: Option<String>) {
    use std::process::{Command, Stdio};

    let mut process = Command::new(pcsx2_path);

    process.arg(iso_path).args(flags.as_slice());

    if let Some(args) = game_args {
        process.arg(format!("--gameargs=\"{}\"", args));
    }

    process
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .spawn()
        .unwrap();
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            read_directory_games,
            read_iso_serial,
            launch_game
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
