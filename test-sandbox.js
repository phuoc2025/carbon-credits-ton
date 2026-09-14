import { Blockchain } from '@ton/sandbox';
import TonCore from '@ton/core';
const { toNano } = TonCore;
import pkg from './contracts/carbon_rewards.tact_CarbonRewards.js';
const { CarbonRewards } = pkg;

async function main() {
  const blockchain = await Blockchain.create();
  const deployer = await blockchain.treasury('deployer');

  const carbonRewards = blockchain.openContract(await CarbonRewards.fromInit());

  await carbonRewards.send(
    deployer.getSender(),
    { value: toNano('0.05') },
    { $$type: 'Deploy', queryId: 0n }
  );

  const user = await blockchain.treasury('user');

  // Gửi đúng cấu trúc message $$type mà Tact đã tạo ra
  await carbonRewards.send(
    user.getSender(),
    { value: toNano('0.05') },
    { $$type: 'RecordCarbon' }
  );

  const metrics = await carbonRewards.getGetMetrics();

  console.log("Chỉ số CO2e đã giảm (kg):", metrics.total_co2e_reduced_kg.toString());
  console.log("Tổng tín chỉ carbon đã đúc:", metrics.total_carbon_credits_minted.toString());
  console.log("Tổng điểm SC đã nhận:", metrics.total_sc_points_minted.toString());
}

main().catch(console.error);