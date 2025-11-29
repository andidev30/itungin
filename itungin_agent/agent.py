"""
Itungin Agent - Main orchestrator agent with sub-agents for Split Bill and Fund Pool.
Uses Google ADK Python and MCP Toolbox for Databases.
"""

import os
from google.adk.agents import Agent
from google.adk.tools import FunctionTool
from toolbox_core import ToolboxSyncClient

from .prompts import SYSTEM_INSTRUCTION, SPLIT_BILL_INSTRUCTION, FUND_POOL_INSTRUCTION


# MCP Toolbox server URL (must be running separately)
MCP_TOOLBOX_URL = os.getenv("MCP_TOOLBOX_URL", "http://127.0.0.1:5000")

# Initialize Toolbox client and load tools
toolbox = ToolboxSyncClient(MCP_TOOLBOX_URL)

# Load raw tools
_fp_raw = {t._name: t for t in toolbox.load_toolset("fund_pool_tools")}
_sb_raw = {t._name: t for t in toolbox.load_toolset("split_bill_tools")}


# === FUND POOL TOOLS ===
def create_fund_pool(title: str, admin_id: str, target_amount: int, contributors: str) -> str:
    """Buat patungan baru dengan daftar kontributor.

    Args:
        title: Judul patungan (misal "Kado Pak Azwar")
        admin_id: User ID yang buat patungan
        target_amount: Target jumlah uang dalam rupiah
        contributors: Nama kontributor dipisah koma (misal "Andi,Budi,Cici")
    """
    return _fp_raw["create-fund-pool"](title=title, admin_id=admin_id, target_amount=target_amount, contributors=contributors)

def record_payment(title_keyword: str, contributor_name: str, amount: int) -> str:
    """Catat pembayaran kontributor.

    Args:
        title_keyword: Kata kunci judul patungan (misal "azwar")
        contributor_name: Nama kontributor
        amount: Jumlah bayar dalam rupiah
    """
    return _fp_raw["record-payment"](title_keyword=title_keyword, contributor_name=contributor_name, amount=amount)

def get_fund_pool(title_keyword: str) -> str:
    """Cari dan tampilkan detail patungan by keyword judul.

    Args:
        title_keyword: Kata kunci judul patungan (misal "azwar" untuk "Kado Pak Azwar")
    """
    return _fp_raw["get-fund-pool"](title_keyword=title_keyword)

def list_fund_pools() -> str:
    """List semua patungan aktif."""
    return _fp_raw["list-fund-pools"]()


# === SPLIT BILL TOOLS ===
def create_split_bill(merchant_name: str, grand_total: int, participants: str) -> str:
    """Buat split bill dengan daftar participant.

    Args:
        merchant_name: Nama merchant/restoran
        grand_total: Total tagihan dalam rupiah
        participants: Daftar participant format "Nama1:Jumlah1,Nama2:Jumlah2" (contoh "Andi:50000,Budi:35000")
    """
    return _sb_raw["create-split-bill"](merchant_name=merchant_name, grand_total=grand_total, participants=participants)

def get_split_bill(merchant_keyword: str) -> str:
    """Cari split bill by keyword merchant name.

    Args:
        merchant_keyword: Kata kunci nama merchant
    """
    return _sb_raw["get-split-bill"](merchant_keyword=merchant_keyword)

def list_split_bills() -> str:
    """List semua split bills terbaru."""
    return _sb_raw["list-split-bills"]()


# Create FunctionTools
fund_pool_tools = [
    FunctionTool(create_fund_pool),
    FunctionTool(record_payment),
    FunctionTool(get_fund_pool),
    FunctionTool(list_fund_pools),
]

split_bill_tools = [
    FunctionTool(create_split_bill),
    FunctionTool(get_split_bill),
    FunctionTool(list_split_bills),
]


# Split Bill Sub-Agent
split_bill_agent = Agent(
    name="split_bill_agent",
    model="gemini-2.0-flash",
    description="Agent untuk menangani Split Bill - pembagian tagihan restoran atau pesanan makanan",
    instruction=SPLIT_BILL_INSTRUCTION,
    tools=split_bill_tools,
)


# Fund Pool Sub-Agent
fund_pool_agent = Agent(
    name="fund_pool_agent",
    model="gemini-2.0-flash",
    description="Agent untuk menangani Fund Pool (Patungan) - iuran bersama untuk tujuan tertentu",
    instruction=FUND_POOL_INSTRUCTION,
    tools=fund_pool_tools,
)


# Root Orchestrator Agent
root_agent = Agent(
    name="itungin_agent",
    model="gemini-2.0-flash",
    description="Itungin - Asisten AI untuk Split Bill dan Patungan",
    instruction=SYSTEM_INSTRUCTION,
    sub_agents=[split_bill_agent, fund_pool_agent],
)
