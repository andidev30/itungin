-- Itungin Database Schema
-- PostgreSQL DDL

-- Fund Pools (Patungan)
CREATE TABLE fund_pools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    admin_id VARCHAR(100) NOT NULL,
    target_amount BIGINT NOT NULL,
    collected_amount BIGINT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'COMPLETED', 'CANCELLED')),
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fund Pool Contributors
CREATE TABLE fund_pool_contributors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pool_id UUID NOT NULL REFERENCES fund_pools(id) ON DELETE CASCADE,
    user_id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    amount_paid BIGINT DEFAULT 0,
    paid_at TIMESTAMPTZ,
    payment_proof_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Split Bills
CREATE TABLE split_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_by VARCHAR(100) NOT NULL,
    merchant_name VARCHAR(255),
    receipt_image_url TEXT,
    rules_prompt TEXT,
    subtotal BIGINT DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    service_charge BIGINT DEFAULT 0,
    discount_amount BIGINT DEFAULT 0,
    grand_total BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Split Bill Items
CREATE TABLE split_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES split_bills(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    qty INT DEFAULT 1,
    price_per_unit BIGINT DEFAULT 0,
    total_price BIGINT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Split Bill Item Assignments (who ordered what)
CREATE TABLE split_bill_item_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES split_bill_items(id) ON DELETE CASCADE,
    participant_name VARCHAR(100) NOT NULL
);

-- Split Bill Participants (final calculation per person)
CREATE TABLE split_bill_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES split_bills(id) ON DELETE CASCADE,
    user_id VARCHAR(100),
    name VARCHAR(100) NOT NULL,
    items_total BIGINT DEFAULT 0,
    tax_share BIGINT DEFAULT 0,
    service_share BIGINT DEFAULT 0,
    discount_share BIGINT DEFAULT 0,
    final_bill BIGINT DEFAULT 0,
    payment_status VARCHAR(20) DEFAULT 'UNPAID' CHECK (payment_status IN ('UNPAID', 'PAID')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_fund_pools_admin_id ON fund_pools(admin_id);
CREATE INDEX idx_fund_pools_status ON fund_pools(status);
CREATE INDEX idx_fund_pool_contributors_pool_id ON fund_pool_contributors(pool_id);
CREATE INDEX idx_split_bills_created_by ON split_bills(created_by);
CREATE INDEX idx_split_bill_items_bill_id ON split_bill_items(bill_id);
CREATE INDEX idx_split_bill_participants_bill_id ON split_bill_participants(bill_id);

