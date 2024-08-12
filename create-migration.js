const { exec } = require('child_process');

// Access command line arguments
const args = process.argv.slice(2);

// Initialize variables with default values
let migrationPath = '/defaultMigrations';
let migrationFile = 'migration';

// Manually parse arguments
args.forEach(arg => {
  if (arg.startsWith('--path=')) {
    migrationPath = arg.split('=')[1];
  }
  if (arg.startsWith('--file=')) {
    migrationFile = arg.split('=')[1];
  }
});

// Construct the full migration path
const fullMigrationPath = `${migrationPath}/${migrationFile}`;

// Construct the command
const command = `npx typeorm migration:create ./migrations${fullMigrationPath} -o`;

// Log the command being run
console.log(`Running command: ${command}`);

// Execute the command
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Migration created at: ${fullMigrationPath}`);
});
