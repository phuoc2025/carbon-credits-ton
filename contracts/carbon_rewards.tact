import "@stdlib/deploy";

message ClaimReward {
    amount: Int as uint64;
}

contract CarbonReward with Deployable {
    owner: Address;
    balances: map<Address, Int>;

    init(owner: Address) {
        self.owner = owner;
    }

    // Hàm phân phối điểm thưởng (chỉ Owner/Backend gọi)
    receive(msg: ClaimReward) {
        let ctx: Context = context();
        require(ctx.sender == self.owner, "Chỉ Owner mới có quyền phân phối thưởng!");
        
        let currentBalance: Int = self.balances.get(ctx.sender) ?? 0;
        self.balances.set(ctx.sender, currentBalance + msg.amount);
    }

    // Hàm cho người dùng kiểm tra số dư điểm của họ
    get fun balance(account: Address): Int {
        return self.balances.get(account) ?? 0;
    }
}