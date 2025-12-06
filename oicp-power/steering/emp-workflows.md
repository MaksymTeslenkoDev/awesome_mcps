# EMP Workflows

This guide covers common workflows for e-Mobility Providers (EMPs) implementing OICP v2.3. EMPs provide EV drivers with access to charging networks and need to discover charging stations, manage user authentication, and retrieve billing information.

## Overview of EMP Responsibilities

As an EMP, you will:
1. **Pull EVSE Data** - Discover and retrieve charging station information
2. **Pull EVSE Status** - Get real-time availability of charging stations
3. **Push Authentication Data** - Register your users' credentials with Hubject
4. **Request Authorization** - Authorize your users to charge at CPO stations
5. **Get Charge Detail Records** - Retrieve billing information for completed sessions

## Workflow 1: Pull EVSE Data

### Purpose
Discover charging stations and retrieve their static information (location, capabilities, connectors) from Hubject.

### When to Use
- Initial setup: Download all available charging stations
- Regular updates: Sync changes to station data
- User search: Find stations near a location
- App updates: Refresh station information

### Operation Details

**Operation**: `eRoamingPullEvseData`  
**Service**: eRoamingData  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand the Data Structure

First, explore what data you'll receive:

```
Get the schema for PullEvseDataRecord in EMP role
```

This shows you'll receive:
- EVSE ID (unique identifier)
- Operator information
- Geographic coordinates
- Address details
- Charging capabilities (power, connectors)
- Payment options
- Accessibility information
- Opening hours
- Pricing information (if available)

#### Step 2: Get Operation Details

```
Get details for eRoamingPullEvseData operation in EMP role
```

This shows:
- Endpoint path and HTTP method
- Request parameters (Provider ID, search criteria)
- Response structure (eRoamingEVSEData)
- Pagination support

#### Step 3: Understand Search Criteria

```
What is the structure of eRoamingPullEVSEData request body?
```

You can filter by:
- Provider ID (your ID)
- Operator IDs (specific CPOs)
- Country codes
- Geographic coordinates and radius
- Last update timestamp (for incremental sync)

#### Step 4: Handle the Response

```
Get the schema for eRoamingEVSEData in EMP role
```

Response contains:
- Array of EVSE data records
- Operator information
- Status code
- Pagination info (if applicable)

### Example Query Flow

```
1. "Show me the eRoamingPullEvseData operation for EMP"
2. "What filters can I use when pulling EVSE data?"
3. "What is the structure of PullEvseDataRecord?"
4. "How do I handle pagination in pull requests?"
```

### Best Practices

- Perform full sync daily during off-peak hours
- Use incremental sync (lastUpdate filter) for frequent updates
- Filter by geographic area for location-based searches
- Cache EVSE data locally to reduce API calls
- Update your database with received data
- Handle large result sets with pagination
- Validate received data before storing
- Track last sync timestamp for incremental updates

---

## Workflow 2: Pull EVSE Status

### Purpose
Get real-time availability status of charging stations to show users which stations are available.

### When to Use
- User searches for available stations
- Refreshing station availability in your app
- Before navigation to a charging station
- Periodic status updates (every 5-15 minutes)

### Operation Details

**Operation**: `eRoamingPullEvseStatus`  
**Service**: eRoamingEvseStatus  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand Status Values

```
Get the schema for EvseStatus in EMP role
```

Status values include:
- Available - Ready for charging
- Occupied - Currently in use
- OutOfService - Not operational
- Reserved - Reserved for specific user
- Unknown - Status not reported

#### Step 2: Get Operation Details

```
Get details for eRoamingPullEvseStatus operation in EMP role
```

#### Step 3: Understand Request Options

You can pull status:
- For all stations (full sync)
- For specific operators
- For specific geographic areas
- By EVSE IDs (specific stations)

#### Step 4: Alternative: Pull Status by ID

```
Get details for eRoamingPullEvseStatusByID operation in EMP role
```

Use this for:
- Checking specific stations
- Real-time status before user navigation
- Verifying availability before authorization

### Example Query Flow

```
1. "Show all operations in eRoamingEvseStatus service for EMP"
2. "Get details for eRoamingPullEvseStatus in EMP"
3. "What is the difference between PullEvseStatus and PullEvseStatusByID?"
4. "What are the valid EVSE status values?"
```

### Best Practices

- Pull status frequently (every 5-15 minutes) for active areas
- Use PullEvseStatusByID for real-time checks of specific stations
- Filter by geographic area to reduce data volume
- Update your local cache with received status
- Show users the most recent status with timestamp
- Handle "Unknown" status gracefully in UI
- Implement retry logic for failed requests
- Consider WebSocket or push notifications for real-time updates (if available)

---

## Workflow 3: Push Authentication Data

### Purpose
Register your users' authentication credentials (RFID cards, app tokens) with Hubject so they can charge at CPO stations.

### When to Use
- When a new user signs up
- When a user receives a new RFID card
- When updating user credentials
- When deactivating user accounts
- Periodic full synchronization

### Operation Details

**Operation**: `eRoamingPushAuthenticationData`  
**Service**: eRoamingAuthenticationData  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand Authentication Data Structure

```
Get the schema for ProviderAuthenticationData in EMP role
```

This shows you need to provide:
- Provider ID (your ID)
- Array of authentication records
- Action type (fullLoad, update, insert, delete)

#### Step 2: Understand Identification Types

```
Search for schemas related to "identification" in EMP role
```

Key identification types:
- **RFIDIdentification**: RFID card credentials
- **QRCodeIdentification**: QR code tokens
- **PlugAndChargeIdentification**: ISO 15118 certificates
- **RemoteIdentification**: App-based authentication

#### Step 3: Get Operation Details

```
Get details for eRoamingPushAuthenticationData operation in EMP role
```

Request includes:
- Action type: "fullLoad", "update", "insert", or "delete"
- Provider ID
- Array of authentication records with:
  - Identification data
  - EVCO ID (user identifier)
  - Validity period

#### Step 4: Understand EVCO ID Format

```
Get the schema for EvcoID in EMP role
```

EVCO ID format: `{Country Code}-{Provider ID}-{Instance}`
Example: `DE-ABC-123456789`

### Example Query Flow

```
1. "Show me the eRoamingPushAuthenticationData operation for EMP"
2. "What identification types can I register?"
3. "What is the format of an EVCO ID?"
4. "How do I structure RFIDIdentification data?"
```

### Best Practices

- Push authentication data immediately when users register
- Use "insert" for new credentials
- Use "update" for credential changes
- Use "delete" when deactivating users
- Use "fullLoad" for daily synchronization
- Validate EVCO ID format before pushing
- Include validity periods for temporary access
- Support multiple identification methods per user
- Implement retry logic for failed pushes
- Log all authentication data changes
- Handle response status codes appropriately

---

## Workflow 4: Request Authorization

### Purpose
Authorize your users to start and stop charging sessions at CPO stations.

### When to Use
- When user initiates charging (app or RFID)
- When user stops charging
- For remote start/stop operations

### Operations

**Direct Authorization**:
- `eRoamingAuthorizeStart` - Authorize session start
- `eRoamingAuthorizeStop` - Authorize session end

**Remote Authorization**:
- `eRoamingAuthorizeRemoteStart` - Request remote start
- `eRoamingAuthorizeRemoteStop` - Request remote stop

### Step-by-Step Implementation

#### Step 1: Understand Authorization Flow

```
Get all operations in eRoamingAuthorization service for EMP
```

#### Step 2: Implement Remote Start

```
Get details for eRoamingAuthorizeRemoteStart operation in EMP role
```

Request includes:
- Provider ID
- EVSE ID (target charging station)
- Identification (user credentials)
- Session ID (optional)
- Partner Product ID (optional)

Response includes:
- Authorization status
- Session ID
- Status code
- CPO Partner Session ID

#### Step 3: Implement Remote Stop

```
Get details for eRoamingAuthorizeRemoteStop operation in EMP role
```

Request includes:
- Provider ID
- EVSE ID
- Session ID
- CPO Partner Session ID

#### Step 4: Handle Authorization Responses

```
What status codes can be returned in authorization responses?
```

Common status codes:
- 000 - Success
- 100-199 - Authorization declined
- 200-299 - Communication errors
- 300-399 - System errors

### Example Query Flow

```
1. "Show me authorization operations for EMP"
2. "Get details for eRoamingAuthorizeRemoteStart in EMP"
3. "What identification methods work for remote start?"
4. "What does status code 210 mean?"
```

### Best Practices

- Validate user credentials before requesting authorization
- Include session ID for tracking
- Handle authorization declined gracefully
- Show clear error messages to users
- Implement timeout handling (5-10 seconds)
- Store session IDs for stop requests
- Support multiple identification methods
- Log all authorization attempts
- Handle network failures with retry logic
- Provide user feedback during authorization

---

## Workflow 5: Get Charge Detail Records

### Purpose
Retrieve billing information for completed charging sessions to bill your users.

### When to Use
- Daily batch retrieval of completed sessions
- Real-time retrieval after session completion
- Monthly billing reconciliation
- Dispute resolution

### Operation Details

**Operation**: `eRoamingGetChargeDetailRecords`  
**Service**: eRoamingAuthorization  
**Method**: POST

### Step-by-Step Implementation

#### Step 1: Understand CDR Structure

```
Get the schema for eRoamingChargeDetailRecord in EMP role
```

CDR contains:
- Session information (ID, timestamps)
- EVSE and operator details
- User identification
- Energy delivered (kWh)
- Charging duration
- Meter readings
- Costs and pricing
- Status codes

#### Step 2: Get Operation Details

```
Get details for eRoamingGetChargeDetailRecords operation in EMP role
```

Request parameters:
- Provider ID
- Date range (from/to timestamps)
- Session IDs (optional, for specific sessions)
- CDR forwarded flag

#### Step 3: Understand Response Structure

```
What is the structure of eRoamingChargeDetailRecords response?
```

Response contains:
- Array of charge detail records
- Status code
- Status message

### Example Query Flow

```
1. "Show me the eRoamingGetChargeDetailRecords operation for EMP"
2. "What information is included in a charge detail record?"
3. "How do I filter CDRs by date range?"
4. "What is the CDRForwarded flag used for?"
```

### Best Practices

- Retrieve CDRs daily during off-peak hours
- Use date range filters to get recent sessions
- Mark CDRs as forwarded after processing
- Validate CDR data before billing users
- Store CDRs for audit and dispute resolution
- Reconcile CDRs with your session records
- Handle missing or delayed CDRs
- Implement retry logic for failed retrievals
- Calculate costs based on CDR data
- Provide detailed billing information to users

---

## Workflow 6: Handling Charging Notifications

### Purpose
Receive real-time updates about ongoing charging sessions from CPOs.

### Operations

**Notification Types** (received from CPOs):
- `eRoamingChargingNotificationStart` - Session started
- `eRoamingChargingNotificationProgress` - Ongoing updates
- `eRoamingChargingNotificationEnd` - Session completed
- `eRoamingChargingNotificationError` - Error occurred

### Step-by-Step Implementation

#### Step 1: Understand Notification Types

```
Get all operations in eRoamingChargingNotifications service for EMP
```

#### Step 2: Implement Notification Handlers

```
Get details for eRoamingChargingNotificationStart in EMP
```

Handle start notifications:
- Update session status to "active"
- Show user that charging has begun
- Store session start information

```
Get details for eRoamingChargingNotificationProgress in EMP
```

Handle progress notifications:
- Update energy delivered
- Update charging duration
- Show real-time progress to user

```
Get details for eRoamingChargingNotificationEnd in EMP
```

Handle end notifications:
- Update session status to "completed"
- Store final energy and duration
- Notify user of completion
- Prepare for CDR retrieval

```
Get details for eRoamingChargingNotificationError in EMP
```

Handle error notifications:
- Update session status to "error"
- Log error details
- Notify user of issue
- Provide support information

### Example Query Flow

```
1. "Show me all charging notification operations for EMP"
2. "What data is included in ChargingNotificationProgress?"
3. "How do I handle charging errors?"
4. "What is the typical frequency of progress notifications?"
```

### Best Practices

- Implement webhook endpoints to receive notifications
- Validate notification authenticity
- Update user interface in real-time
- Store all notifications for audit trail
- Handle duplicate notifications (idempotency)
- Correlate notifications with session IDs
- Provide user notifications for important events
- Handle out-of-order notifications
- Implement timeout detection for missing notifications

---

## Common EMP Integration Patterns

### Initial Setup Sequence

1. Pull full EVSE data (all stations)
2. Pull initial EVSE status
3. Push authentication data for all users
4. Begin periodic status updates
5. Start handling charging sessions

### Daily Operations

1. Morning: Pull EVSE data updates
2. Continuous: Pull EVSE status updates (every 5-15 min)
3. Continuous: Handle user authorization requests
4. Continuous: Receive charging notifications
5. Evening: Retrieve charge detail records
6. Night: Full authentication data sync

### User Session Flow

1. User searches for stations → Pull EVSE data/status
2. User selects station → Pull specific status
3. User starts charging → Authorize remote start
4. Charging in progress → Receive notifications
5. User stops charging → Authorize remote stop
6. Session complete → Retrieve CDR
7. Bill user → Process CDR data

### Error Handling

- Implement retry logic for all API calls
- Cache EVSE data for offline scenarios
- Handle authorization timeouts gracefully
- Validate all received data
- Log all API interactions
- Monitor response status codes
- Provide clear user error messages

### Testing Your Integration

```
1. "Show me example request for eRoamingPullEvseData"
2. "What are common error codes in pull operations?"
3. "How do I validate EVCO ID format?"
4. "What fields are mandatory in authentication data?"
```

---

## Additional Resources

- See [getting-started.md](./getting-started.md) for basic OICP concepts
- See [cpo-workflows.md](./cpo-workflows.md) for CPO perspective
- Access full EMP OpenAPI spec: `oicp://emp/spec`
- View EMP HTML documentation: `oicp://emp/docs`

## Quick Reference

### Key EMP Operations

| Operation | Service | Purpose |
|-----------|---------|---------|
| eRoamingPullEvseData | eRoamingData | Discover charging stations |
| eRoamingPullEvseStatus | eRoamingEvseStatus | Get station availability |
| eRoamingPushAuthenticationData | eRoamingAuthenticationData | Register user credentials |
| eRoamingAuthorizeRemoteStart | eRoamingAuthorization | Start charging session |
| eRoamingAuthorizeRemoteStop | eRoamingAuthorization | Stop charging session |
| eRoamingGetChargeDetailRecords | eRoamingAuthorization | Retrieve billing data |

### Tool Usage Patterns

- **Discover**: `search_oicp_operations` → `get_operation_details`
- **Explore Data**: `get_data_schema` → understand structure
- **Find Schemas**: `search_schemas` → locate data types
- **Browse Services**: `list_services` → `get_operations_by_tag`
- **Validate**: Check operation details and required fields

### Data Synchronization Schedule

| Data Type | Frequency | Method |
|-----------|-----------|--------|
| EVSE Data | Daily | Pull (fullLoad) |
| EVSE Status | 5-15 min | Pull (incremental) |
| Authentication | On change + daily | Push (update/fullLoad) |
| CDRs | Daily | Get (date range) |
| Real-time Status | On demand | Pull by ID |
