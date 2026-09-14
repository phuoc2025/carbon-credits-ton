import { Blockchain, SandboxContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { CarbonRewards } from '../build/carbon_rewards_CarbonRewards';
import '@ton/testutils';

describe('CarbonRewards Contract Tests', () => {
  let blockchain: Blockchain;
  let carbonRewards: SandboxContract<CarbonRewards>;
  let deployer: any;

  beforeEach(async () => {
    // Khởi tạo blockchain ảo cục bộ
    blockchain = await Blockchain.create();
    deployer = await blockchain.treasury('deployer');

    // Biên dịch và deploy contract vào sandbox
    carbonRewards = blockchain.openContract(await CarbonRewards.fromInit());

    const deployResult = await carbonRewards.send(
      deployer.getSender(),
      {
        value: toNano('0.05'),
      },
      {
        $$type: 'Deploy',
        queryId: 0n,
      }
    );

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: carbonRewards.address,
      success: true,
    });
  });

  it('nên cập nhật chính xác các chỉ số khi nhận được thông điệp RecordCarbon', async () => {
    const user = await blockchain.treasury('user');

    // Gửi thông điệp chuỗi "RecordCarbon" kèm theo một ít TON/GRAM
    const result = await carbonRewards.send(
      user.getSender(),
      {
        value: toNano('0.05'),
      },
      "RecordCarbon"
    );

    // Kiểm tra giao dịch thành công không bị bounce
    expect(result.transactions).toHaveTransaction({
      from: user.address,
      to: carbonRewards.address,
      success: true,
    });

    // Gọi hàm getter getMetrics để kiểm tra giá trị on-chain
    const metrics = await carbonRewards.getGetMetrics();
    
    expect(metrics.totalCo2eReducedKg).toEqual(1000n);
    expect(metrics.totalCarbonCreditsMinted).toEqual(1n);
    expect(metrics.totalScPointsMinted).toEqual(100n);
  });
});