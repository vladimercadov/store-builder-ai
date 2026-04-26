import { optimizeGLB } from './optimize-asset';
import path from 'path';
import fs from 'fs';

const run = async () => {
  const args = process.argv.slice(2);
  const input = args[0];
  const output = args[1] || path.join(process.cwd(), 'optimized_output.glb');

  if (!input) {
    console.error("❌ Error: Debes proporcionar un archivo modelo de entrada.");
    console.log("Uso: npx tsx scripts/run-optimizer.ts <ruta_archivo.glb> [ruta_salida.glb]");
    process.exit(1);
  }

  if (!fs.existsSync(input)) {
    console.error(`❌ Error: El archivo ${input} no existe.`);
    process.exit(1);
  }

  console.log(`\n⏳ Iniciando Pipeline de Optimización IA para Render AR...`);
  console.log(`[>>] Procesando: ${input}`);
  
  try {
    const result = await optimizeGLB(input, output, 1250000); // 1.25M COP mock price

    console.log(`\n✅ ARCHIVO OPTIMIZADO: ${output}`);
    console.log(`\n--- REPORTE DE VALIDACIÓN (JSON) ---`);
    console.log(JSON.stringify(result, null, 2));
    console.log(`------------------------------------\n`);

  } catch (error) {
    console.error('\n❌ Fallo crítico en el pipeline 3D:', error);
  }
};

run();
