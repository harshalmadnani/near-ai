#!/bin/bash

# ETH Sell Bot Monitoring Script
# Monitors bot-1754828246597 that sells 0.0003 ETH every minute

API_URL="https://near-ai.onrender.com"
BOT_ID="bot-1754828246597"
SLEEP_INTERVAL=30  # Check every 30 seconds

echo "🤖 Starting ETH Sell Bot Monitor"
echo "=================================="
echo "Bot ID: $BOT_ID"
echo "API URL: $API_URL"
echo "Monitoring interval: ${SLEEP_INTERVAL}s"
echo "=================================="
echo ""

# Function to get current timestamp
get_timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

# Function to check bot status
check_bot_status() {
    echo "[$(get_timestamp)] 📊 Checking bot status..."
    
    # Get bot details
    BOT_STATUS=$(curl -s "$API_URL/api/bots/$BOT_ID" | jq -r '.data.isActive // "unknown"')
    
    if [ "$BOT_STATUS" = "true" ]; then
        echo "[$(get_timestamp)] ✅ Bot is ACTIVE"
    elif [ "$BOT_STATUS" = "false" ]; then
        echo "[$(get_timestamp)] ⚠️  Bot is INACTIVE"
    else
        echo "[$(get_timestamp)] ❌ Unable to get bot status"
    fi
}

# Function to check execution logs
check_logs() {
    echo "[$(get_timestamp)] 📋 Checking recent logs..."
    
    LOGS=$(curl -s "$API_URL/api/bots/$BOT_ID/logs")
    LOG_COUNT=$(echo "$LOGS" | jq '.data | length // 0')
    
    echo "[$(get_timestamp)] 📝 Total log entries: $LOG_COUNT"
    
    # Show latest log entry if available
    if [ "$LOG_COUNT" -gt 0 ]; then
        LATEST_LOG=$(echo "$LOGS" | jq -r '.data[-1] | "\(.timestamp) - \(.action): \(.message)"')
        echo "[$(get_timestamp)] 🔍 Latest: $LATEST_LOG"
    fi
}

# Function to check active bots count
check_active_bots() {
    echo "[$(get_timestamp)] 🌐 Checking API status..."
    
    ACTIVE_COUNT=$(curl -s "$API_URL/api/bots/status/active" | jq -r '.data | length // 0')
    echo "[$(get_timestamp)] 🚀 Active bots: $ACTIVE_COUNT"
}

# Function to show bot trading details
show_bot_details() {
    echo "[$(get_timestamp)] 💱 ETH Sell Bot Details:"
    echo "  • Sells: 0.0003 ETH → USDC"
    echo "  • Network: Base"
    echo "  • Frequency: Every minute"
    echo "  • Value: ~$1.25 per transaction"
    echo "  • Status: Currently monitoring..."
    echo ""
}

# Main monitoring loop
main() {
    show_bot_details
    
    while true; do
        echo "----------------------------------------"
        check_bot_status
        check_logs
        check_active_bots
        echo "----------------------------------------"
        echo "[$(get_timestamp)] 😴 Sleeping for ${SLEEP_INTERVAL}s..."
        echo ""
        sleep $SLEEP_INTERVAL
    done
}

# Trap Ctrl+C to exit gracefully
trap 'echo -e "\n[$(get_timestamp)] 🛑 Monitoring stopped. Bot continues running on server."; exit 0' INT

# Start monitoring
main
